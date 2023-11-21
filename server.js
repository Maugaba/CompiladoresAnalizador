const express = require('express');
const { exec } = require('child_process');
const multer = require('multer');
const fs = require('fs').promises;
const { PDFDocument, rgb } = require('pdf-lib');
const JSZip = require('jszip');

const app = express();
const port = 3000;

app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const allowedExtensions = ['.ml'];
  
      // Obtener la extensión del archivo sin el punto
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
  
      if (allowedExtensions.includes(`.${fileExtension}`)) {
        cb(null, true);
      } else {
        cb(new Error('Tipo de archivo no permitido. Solo se permiten archivos con extensión .ml'));
      }
    },
  });
  

app.post('/Ejecutaranalizador', upload.single('userFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }

    const userCode = req.file.buffer.toString('utf-8');
    const fileExtension = req.file.originalname.split('.').pop();

    try {
        await fs.writeFile(`temp.${fileExtension}`, userCode);

        exec(`bmlang.exe < temp.${fileExtension}`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).send('Error al leer el archivo.');
            }

            const outputLines = stdout.split('\n');
            const reportParts = [];
            let currentPart = '';

            for (const line of outputLines) {
                if (line.trim() === '----------------------------------------------------------') {
                    reportParts.push(currentPart);
                    currentPart = '';
                } else {
                    currentPart += line + '\n';
                }
            }

            if (currentPart.trim() !== '') {
                reportParts.push(currentPart);
            }

            const zip = new JSZip();
            const pdfDoc = await PDFDocument.create();

            let page = pdfDoc.addPage();
            let y = page.getHeight() - 50;

            const fontSize = 12;

            for (let i = 0; i < reportParts.length; i++) {
                const text = `Contenido del archivo (${fileExtension}):\n\n${userCode}\n\nCódigo de tres direcciones:\n\n${reportParts[i]}`;

                let lines = text.split('\n');
                for (const line of lines) {
                    const text = page.drawText(line, {
                        x: 50,
                        y,
                        size: fontSize,
                        color: rgb(0, 0, 0),
                    });

                    y -= fontSize + 2;

                    if (y <= 50) {
                        page = pdfDoc.addPage();
                        y = page.getHeight() - 50;
                    }
                }

                const pdfBytes = await pdfDoc.save();

                zip.file(`CodigoTresDirecciones.pdf`, pdfBytes);
            }

        exec(`bmlangassembler.exe < temp.${fileExtension}`, async (asmError, asmStdout, asmStderr) => {
            if (asmError) {
                console.error(`Error en el ensamblador: ${asmError.message}`);
                return res.status(500).send('Error al ensamblar el archivo.');
            }

            const asmPdfDoc = await PDFDocument.create();
            let asmPdfPage = asmPdfDoc.addPage();
            const asmPdfFontSize = 12;

            const asmText = `Contenido del archivo (${fileExtension}):\n\n${userCode}\n\nCódigo Ensamblador:\n\n${asmStdout}`;

            let asmLines = asmText.split('\n');
            let asmY = asmPdfPage.getHeight() - 50;

            for (const asmLine of asmLines) {
                const asmText = asmPdfPage.drawText(asmLine, {
                    x: 50,
                    y: asmY,
                    size: asmPdfFontSize,
                    color: rgb(0, 0, 0),
                });

                asmY -= asmPdfFontSize + 2;

                if (asmY <= 50) {
                    asmPdfPage = asmPdfDoc.addPage();
                    asmY = asmPdfPage.getHeight() - 50;
                }
            }

            const asmPdfBytes = await asmPdfDoc.save();

            zip.file('CodigoEnsamblador.pdf', asmPdfBytes);

            const zipContent = await zip.generateAsync({ type: 'nodebuffer' });

            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename=TresDireccionesYTasm.zip');
            res.send(zipContent);
        });
        });
    } catch (error) {
        console.error(`Error al escribir o guardar el archivo subido: ${error.message}`);
        return res.status(500).send('Error al leer el archivo.');
    }
});

app.listen(port, () => {
    console.log(`Servidor activo en http://localhost:${port}`);
});
