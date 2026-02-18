const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER || process.env.EMAIL_USER,
            pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
        }
    });
};

const baseStyles = `
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333; }
    .wrapper { width: 100%; padding: 40px 0; }
    .container { max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; overflow: hidden; }
    .header { padding: 28px 20px; text-align: center; border-bottom: 1px solid #e5e5e5; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 3px; color: #111; }
    .content { padding: 32px 36px; color: #444; font-size: 15px; line-height: 1.7; }
    .label { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: #999; margin-bottom: 16px; }
    .divider { border: none; border-top: 1px solid #ebebeb; margin: 24px 0; }
    .info-table { width: 100%; border-collapse: collapse; }
    .info-table tr td { padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
    .info-table tr:last-child td { border-bottom: none; }
    .info-table td:first-child { color: #888; width: 45%; }
    .info-table td:last-child { font-weight: 500; color: #111; text-align: right; }
    .total-row td { font-size: 16px; font-weight: 700; color: #111; padding-top: 16px !important; border-top: 2px solid #e5e5e5 !important; border-bottom: none !important; }
    .btn { display: inline-block; padding: 12px 28px; border-radius: 5px; font-size: 14px; font-weight: 600; text-decoration: none; letter-spacing: 0.5px; }
    .btn-dark { background-color: #111; color: #ffffff; }
    .footer { text-align: center; padding: 24px 20px; color: #aaa; font-size: 12px; border-top: 1px solid #ebebeb; background-color: #fafafa; line-height: 1.8; }
    .footer a { color: #555; text-decoration: none; }
`;

// 1. Notification agence - nouvelle réservation
exports.sendNewBookingNotification = async (bookingData, carDetails) => {
    try {
        const transporter = createTransporter();
        const agencyEmail = process.env.AGENCY_EMAIL || process.env.EMAIL_USER;
        const { first_name, last_name, email, phone, pickup_location, dropoff_location, pickup_date, return_date, total_price, notes } = bookingData;

        const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>${baseStyles}</style>
</head>
<body>
<div class="wrapper">
    <div class="container">
        <div class="header">
            <h1>AUTOSAM</h1>
        </div>

        <div class="content">
            <p class="label">Nouvelle demande</p>
            <p style="margin: 0 0 24px 0; color: #333;">Un client vient de soumettre une demande de réservation.</p>

            <hr class="divider">

            <p class="label" style="margin-top: 0;">Client</p>
            <table class="info-table">
                <tr><td>Nom</td><td>${first_name} ${last_name}</td></tr>
                <tr><td>Email</td><td>${email}</td></tr>
                <tr><td>Téléphone</td><td>${phone}</td></tr>
            </table>

            <hr class="divider">

            <p class="label" style="margin-top: 0;">Véhicule</p>
            ${carDetails ? `
            <table class="info-table">
                <tr><td>Modèle</td><td>${carDetails.brand} ${carDetails.model} (${carDetails.year})</td></tr>
                <tr><td>Prix / jour</td><td>${carDetails.price_per_day} MAD</td></tr>
            </table>
            ` : '<p style="color:#888; font-size:14px;">Informations non disponibles</p>'}

            <hr class="divider">

            <p class="label" style="margin-top: 0;">Réservation</p>
            <table class="info-table">
                <tr><td>Prise en charge</td><td>${pickup_location}</td></tr>
                <tr><td>Restitution</td><td>${dropoff_location}</td></tr>
                <tr><td>Date départ</td><td>${pickup_date}</td></tr>
                <tr><td>Date retour</td><td>${return_date}</td></tr>
                ${notes ? `<tr><td>Notes</td><td>${notes}</td></tr>` : ''}
                <tr class="total-row"><td>Total</td><td>${total_price} MAD</td></tr>
            </table>

            <div style="text-align: center; margin-top: 32px;">
                <a href="tel:${phone}" class="btn btn-dark">Appeler le client</a>
            </div>
        </div>

        <div class="footer">
            <p>© ${new Date().getFullYear()} AUTOSAM — Notification automatique</p>
        </div>
    </div>
</div>
</body>
</html>`;

        await transporter.sendMail({
            from: `"AUTOSAM" <${process.env.EMAIL_USER}>`,
            to: agencyEmail,
            subject: `Nouvelle réservation — ${first_name} ${last_name}`,
            html: emailContent
        });

        console.log(`✅ Email agence envoyé : ${agencyEmail}`);
        return { success: true };
    } catch (error) {
        console.error('❌ Erreur email agence:', error);
        return { success: false, error: error.message };
    }
};

// 2. Confirmation client
exports.sendBookingConfirmation = async (bookingData) => {
    try {
        const transporter = createTransporter();
        const { email, first_name, car_name, pickup_date, return_date, pickup_location, total_price } = bookingData;

        const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${baseStyles}</style>
</head>
<body>
<div class="wrapper">
    <div class="container">
        <div class="header">
            <h1>AUTOSAM</h1>
        </div>

        <div class="content">
            <p style="margin: 0 0 6px 0; font-size: 18px; font-weight: 600; color: #111;">Bonjour ${first_name},</p>
            <p style="margin: 0 0 28px 0; color: #666;">Votre demande de réservation a bien été reçue. Nous vous contacterons prochainement pour confirmation.</p>

            <hr class="divider" style="margin-top: 0;">

            <p class="label" style="margin-top: 0;">Détails de la réservation</p>
            <table class="info-table">
                <tr><td>Véhicule</td><td>${car_name}</td></tr>
                <tr><td>Date départ</td><td>${new Date(pickup_date).toLocaleDateString('fr-FR')}</td></tr>
                <tr><td>Date retour</td><td>${new Date(return_date).toLocaleDateString('fr-FR')}</td></tr>
                <tr><td>Lieu</td><td>${pickup_location}</td></tr>
                <tr class="total-row"><td>Total</td><td>${total_price} MAD</td></tr>
            </table>

            <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings" class="btn btn-dark">Voir ma réservation</a>
            </div>
        </div>

        <div class="footer">
            <p>Merci de faire confiance à AUTOSAM</p>
            <p>Questions ? <a href="mailto:contact@autosam.ma">contact@autosam.ma</a></p>
            <p style="margin-top: 12px;">© ${new Date().getFullYear()} AUTOSAM</p>
        </div>
    </div>
</div>
</body>
</html>`;

        await transporter.sendMail({
            from: `"AUTOSAM" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Demande de réservation reçue — AUTOSAM`,
            html: emailContent
        });

        console.log(`✅ Email confirmation envoyé : ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur email confirmation:', error);
        return false;
    }
};

// 3. Mise à jour statut (couleur appliquée selon le statut uniquement)
exports.sendStatusUpdate = async (bookingData, newStatus) => {
    try {
        const transporter = createTransporter();
        const { email, first_name, car_name } = bookingData;

        const statusConfig = {
            confirmed: { label: 'Confirmée',   color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
            cancelled:  { label: 'Annulée',    color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
            completed:  { label: 'Terminée',   color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
            pending:    { label: 'En attente', color: '#d97706', bg: '#fffbeb', border: '#fde68a' }
        };

        const status = statusConfig[newStatus] || statusConfig.pending;

        const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${baseStyles}</style>
</head>
<body>
<div class="wrapper">
    <div class="container">
        <div class="header">
            <h1>AUTOSAM</h1>
        </div>

        <div class="content">
            <p style="margin: 0 0 6px 0; font-size: 18px; font-weight: 600; color: #111;">Bonjour ${first_name},</p>
            <p style="margin: 0 0 28px 0; color: #666;">Le statut de votre réservation pour le véhicule <strong>${car_name}</strong> a été mis à jour.</p>

            <div style="
                background-color: ${status.bg};
                border: 1px solid ${status.border};
                border-left: 4px solid ${status.color};
                border-radius: 5px;
                padding: 16px 20px;
                margin: 8px 0 28px 0;
            ">
                <p style="margin: 0; font-size: 13px; color: #888; letter-spacing: 1px; text-transform: uppercase; font-weight: 600;">Statut</p>
                <p style="margin: 4px 0 0 0; font-size: 17px; font-weight: 700; color: ${status.color};">${status.label}</p>
            </div>

            <div style="text-align: center; margin-top: 8px;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings"
                   class="btn"
                   style="background-color: ${status.color}; color: #fff;">
                    Voir les détails
                </a>
            </div>
        </div>

        <div class="footer">
            <p>AUTOSAM — Location de voitures</p>
            <p>Cet email a été envoyé automatiquement.</p>
            <p style="margin-top: 12px;">© ${new Date().getFullYear()} AUTOSAM</p>
        </div>
    </div>
</div>
</body>
</html>`;

        await transporter.sendMail({
            from: `"AUTOSAM" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Réservation ${status.label} — AUTOSAM`,
            html: emailContent
        });

        console.log(`✅ Email statut envoyé : ${email}`);
        return true;
    } catch (error) {
        console.error('❌ Erreur email statut:', error);
        return false;
    }
};