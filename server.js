const express = require('express');
const { exec } = require('child_process');
const multer = require('multer');
const fs = require('fs').promises;
const { PDFDocument, rgb } = require('pdf-lib'); // Importa desde pdf-lib
const JSZip = require('jszip');

const app = express();
const port = 3000;

app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/Ejecutaranalizador', upload.single('phpFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo .php.');
    }

    const phpCode = req.file.buffer.toString('utf-8');

    try {
        await fs.writeFile('temp.php', phpCode);

        exec('analizadorphp.exe < temp.php', async (error, stdout, stderr) => {
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
            j=2;
            encabezado = "Reporte de Lexemas y tokens\n";
            for (let i = 0; i < reportParts.length; i++) {
                const pdfDoc = await PDFDocument.create();
            
                let page = pdfDoc.addPage();
                const fontSize = 12;
            
                const textHeight = page.getHeight() - 50;
                const textWidth = page.getWidth() / 2;
            
                const cleanedPart = reportParts[i].trim();
                const partLines = cleanedPart.split('\n');
                let y = textHeight;
            
                const header = `${encabezado}`;
                const textSize = fontSize + 2;
                const estimatedHeaderWidth = header.length * 6; 

                page.drawText(header, {
                    x: textWidth - estimatedHeaderWidth / 2, 
                    y: textHeight + 10, 
                    size: textSize, 
                    color: rgb(0, 0, 0),
                });
                y -= fontSize + 12;
                for (const partLine of partLines) {
                    const text = page.drawText(partLine, {
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
            
                zip.file(`Reporte${j}.pdf`, pdfBytes);
                j=1;
                encabezado = "Reporte cantidad de datos y conteo de palabras reservadas\n";
            }

            const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Disposition', 'attachment; filename=Reportes.zip');
            res.send(zipContent);
        });
    } catch (error) {
        console.error(`Error al escribir el guardar el archivo subido: ${error.message}`);
        return res.status(500).send('Error al leer el archivo.');
    }
});

app.listen(port, () => {
    console.log(`Servidor activo en http://localhost:${port}`);
});
