const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = 3000;

// Add middleware to parse JSON bodies
app.use(express.json());
app.use(express.static(__dirname));

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Specific route for favicon
app.get('/images/icon.png', (req, res) => {
    res.sendFile(path.join(__dirname, 'images', 'icon.png'));
});

// Route for the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for opportunities page
app.get('/oportunidades', (req, res) => {
    res.sendFile(path.join(__dirname, 'oportunidades.html'));
});

// Route for interests page
app.get('/interesses', (req, res) => {
    res.sendFile(path.join(__dirname, 'interesses.html'));
});

// Route for "Sobre Nós" page
app.get('/sobrenos', (req, res) => {
    res.sendFile(path.join(__dirname, 'sobrenos.html'));
});

// Route for contact form page
app.get('/contactos', (req, res) => {
    res.sendFile(path.join(__dirname, 'contactos.html'));
});

// New POST route for handling form submissions
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message, rating } = req.body;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'pedro.coutinho251@gmail.com',
        subject: `ClearPath: ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #004AAD;">Nova Mensagem do ClearPath</h2>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Assunto:</strong> ${subject}</p>
                    <p><strong>Classificação:</strong> ${rating ? `${rating} estrelas` : 'Não fornecida'}</p>
                </div>

                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
                    <h3 style="color: #004AAD;">Mensagem:</h3>
                    <p style="white-space: pre-line;">${message}</p>
                </div>

                <p style="color: #666; font-size: 12px; margin-top: 20px;">
                    Enviado através do formulário de contacto ClearPath
                </p>
            </div>
        `
    };

    try {
        // Log the email configuration (remove sensitive data)
        console.log('Attempting to send email...');
        console.log('From:', process.env.EMAIL_USER);
        console.log('To: pedro.coutinho251@gmail.com');
        console.log('Subject:', `ClearPath: ${subject}`);

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        res.json({ success: true, message: 'Email enviado com sucesso!' });
    } catch (error) {
        console.error('Detailed error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Erro ao enviar email.',
            error: error.message 
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});