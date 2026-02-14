const nodemailer = require('nodemailer');

// Create transporter using SMTP configuration
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || process.env.EMAIL_USER,
            pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
        }
    });
};

// Styles configuration for reuse
const mainStyles = `
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding-bottom: 40px; }
    .webkit { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { padding: 30px 20px; text-align: center; }
    .content { padding: 0 30px 30px 30px; color: #4b5563; line-height: 1.6; }
    .info-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; }
    .info-row td { padding: 12px; background-color: #f9fafb; border: 1px solid #e5e7eb; }
    .info-row td:first-child { border-radius: 8px 0 0 8px; border-right: none; font-weight: 600; color: #374151; width: 40%; }
    .info-row td:last-child { border-radius: 0 8px 8px 0; border-left: none; color: #111827; text-align: right; }
    .price-box { background-color: #fef2f2; border: 1px dashed #dc2626; color: #dc2626; padding: 15px; border-radius: 8px; text-align: center; font-size: 20px; font-weight: bold; margin: 25px 0; }
    .button { display: inline-block; background-color: #dc2626; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 10px; font-size: 16px; box-shadow: 0 2px 4px rgba(220, 38, 38, 0.2); }
    .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 13px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; }
    .status-badge { display: inline-block; padding: 8px 20px; border-radius: 50px; font-weight: bold; font-size: 14px; margin-bottom: 20px; }
`;

// Send booking confirmation email
exports.sendBookingConfirmation = async (bookingData) => {
    try {
        const transporter = createTransporter();
        
        const { email, first_name, last_name, car_name, pickup_date, return_date, pickup_location, total_price, id } = bookingData;
        
        const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${mainStyles}</style>
</head>
<body>
    <div class="wrapper">
        <br>
        <div class="webkit">
            <div class="header" style="background-color: #dc2626;">
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px;">AUTOSIMO</h1>
            </div>

            <div class="content">
                <div style="text-align: center; margin-top: 30px;">
                    <div style="background-color: #dcfce7; color: #166534; display: inline-block; padding: 10px 20px; border-radius: 50px; font-weight: bold; margin-bottom: 15px;">
                        ✓ Réservation Confirmée
                    </div>
                    <h2 style="margin: 0 0 10px 0; color: #111827;">Bonjour ${first_name},</h2>
                    <p style="margin: 0; color: #6b7280;">Votre voyage commence ici ! Voici les détails.</p>
                </div>

                <div style="margin-top: 30px;">
                    <h3 style="color: #374151; font-size: 16px; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">
                        Détails de la commande #${id}
                    </h3>
                    
                    <table class="info-table">
                        <tr class="info-row">
                            <td>🚗 Voiture</td>
                            <td><strong>${car_name}</strong></td>
                        </tr>
                        <tr class="info-row">
                            <td>📅 Départ</td>
                            <td>${new Date(pickup_date).toLocaleDateString('fr-FR')}</td>
                        </tr>
                        <tr class="info-row">
                            <td>📅 Retour</td>
                            <td>${new Date(return_date).toLocaleDateString('fr-FR')}</td>
                        </tr>
                        <tr class="info-row">
                            <td>📍 Lieu</td>
                            <td>${pickup_location}</td>
                        </tr>
                    </table>

                    <div class="price-box">
                        Total: ${total_price} MAD
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings" class="button">
                            Gérer ma réservation
                        </a>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p style="margin-bottom: 10px;">Merci de faire confiance à <strong>AUTOSIMO</strong></p>
                <p>
                    Besoin d'aide ? Contactez-nous :<br>
                    <a href="mailto:contact@autosimo.ma" style="color: #dc2626; text-decoration: none;">contact@autosimo.ma</a>
                </p>
                <p style="margin-top: 20px; font-size: 11px;">
                    © ${new Date().getFullYear()} AUTOSIMO. Tous droits réservés.
                </p>
            </div>
        </div>
        <br>
    </div>
</body>
</html>
        `;
        
        const mailOptions = {
            from: `"AUTOSIMO" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `✓ Réservation #${id} confirmée - AUTOSIMO`,
            html: emailContent
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`✓ Email de confirmation envoyé à ${email}`);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
};

// Send status update email
exports.sendStatusUpdate = async (bookingData, newStatus) => {
    try {
        const transporter = createTransporter();
        
        const { email, first_name, last_name, car_name, id } = bookingData;
        
        // Configuration visually improved for each status
        const statusConfig = {
            confirmed: { 
                label: 'Confirmée', 
                bgColor: '#dcfce7', // Light Green
                textColor: '#166534', // Dark Green
                headerColor: '#16a34a',
                icon: '✓' 
            },
            cancelled: { 
                label: 'Annulée', 
                bgColor: '#fee2e2', // Light Red
                textColor: '#991b1b', // Dark Red
                headerColor: '#dc2626',
                icon: '✕' 
            },
            completed: { 
                label: 'Terminée', 
                bgColor: '#dbeafe', // Light Blue
                textColor: '#1e40af', // Dark Blue
                headerColor: '#2563eb',
                icon: '🏁' 
            },
            pending: { 
                label: 'En attente', 
                bgColor: '#fef9c3', // Light Yellow
                textColor: '#854d0e', // Dark Yellow
                headerColor: '#ca8a04',
                icon: '⏳' 
            }
        };
        
        const currentStatus = statusConfig[newStatus] || statusConfig.pending;
        
        const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${mainStyles}</style>
</head>
<body>
    <div class="wrapper">
        <br>
        <div class="webkit">
            <div class="header" style="background-color: ${currentStatus.headerColor};">
                 <h1 style="margin: 0; color: #ffffff; font-size: 24px;">AUTOSIMO</h1>
            </div>
            
            <div class="content" style="text-align: center; padding-top: 40px;">
                <div class="status-badge" style="background-color: ${currentStatus.bgColor}; color: ${currentStatus.textColor};">
                    ${currentStatus.icon} Réservation ${currentStatus.label}
                </div>

                <h2 style="margin: 20px 0 10px 0; color: #1f2937;">Mise à jour de statut</h2>
                
                <p style="font-size: 16px; margin-bottom: 30px;">
                    Bonjour <strong>${first_name}</strong>,<br><br>
                    Le statut de votre réservation <strong>#${id}</strong> pour la voiture <br>
                    <strong style="color: ${currentStatus.headerColor}; font-size: 18px;">${car_name}</strong><br>
                    a été modifié.
                </p>

                <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Nouveau statut</p>
                    <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: bold; color: ${currentStatus.headerColor};">
                        ${currentStatus.label.toUpperCase()}
                    </p>
                </div>

                <div style="margin-top: 40px;">
                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings" class="button" style="background-color: ${currentStatus.headerColor};">
                        Voir les détails
                    </a>
                </div>
            </div>

            <div class="footer">
                <p>AUTOSIMO - Location de voitures</p>
                <p style="font-size: 11px;">Cet email a été envoyé automatiquement.</p>
            </div>
        </div>
        <br>
    </div>
</body>
</html>
        `;
        
        const mailOptions = {
            from: `"AUTOSIMO" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `${currentStatus.icon} Statut réservation #${id}: ${currentStatus.label} - AUTOSIMO`,
            html: emailContent
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`✓ Email de mise à jour envoyé à ${email}`);
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return false;
    }
};