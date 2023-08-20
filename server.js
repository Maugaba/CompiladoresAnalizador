const express = require('express');
const { exec } = require('child_process');
const multer = require('multer');
const fs = require('fs').promises;
const PDFDocument = require('pdfkit');



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

        const executableOutput = exec('analizadorphp.exe < temp.php', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return res.status(500).send('Error al leer el archivo.');
            }

            const pdfDoc = new PDFDocument({ bufferPages: true });
            pdfDoc.text('Aqui va el texto de el encavezzados del pdf:');

            const outputLines = stdout.split('\n');
            for (const line of outputLines) {
                const cleanedLine = line.trim(); 
                pdfDoc.text(cleanedLine);
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=Reporte1.pdf');
            res.setHeader('Content-Transfer-Encoding', 'binary'); // Agrega esta línea

            pdfDoc.pipe(res);
            pdfDoc.end();


        });
    } catch (error) {
        console.error(`Error al escribir el guardar el archivo subido: ${error.message}`);
        return res.status(500).send('Error al leer el archivo.');
    }
});
app.listen(port, () => {
    console.log(`Servidor activo en http://localhost:${port}`);    
});

