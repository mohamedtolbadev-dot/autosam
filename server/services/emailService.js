const nodemailer = require('nodemailer');

const createTransporter = () => {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = process.env.SMTP_PORT || 587;
    const user = process.env.SMTP_USER || process.env.EMAIL_USER;
    const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    
    console.log('📧 Email Config:', { host, port, user: user ? '***' : 'MISSING', pass: pass ? '***' : 'MISSING' });
    
    return nodemailer.createTransport({
        host: host,
        port: port,
        secure: false,
        auth: {
            user: user,
            pass: pass
        }
    });
};

const baseStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%); color: #222; min-height: 100vh; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    .wrapper { padding: 20px 10px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); overflow: hidden; width: 100%; }
    .header { padding: 30px 20px 24px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-bottom: 3px solid #c41e3a; }
    .header h1 { font-size: 13px; font-weight: 800; letter-spacing: 5px; text-transform: uppercase; color: #ffffff; text-align: center; }
    .content { padding: 24px 20px; font-size: 15px; line-height: 1.7; color: #444; }
    .section-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #c41e3a; margin-bottom: 12px; margin-top: 24px; display: flex; align-items: center; gap: 10px; }
    .section-title::before { content: ''; width: 4px; height: 16px; background: #c41e3a; border-radius: 2px; }
    .divider { border: none; border-top: 1px solid #e8e8e8; margin: 20px 0; }
    .divider-thick { border: none; border-top: 2px solid #c41e3a; margin: 16px 0; width: 60px; }
    .info-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
    .info-table tr td { padding: 10px 0; font-size: 14px; border-bottom: 1px dashed #e0e0e0; word-wrap: break-word; }
    .info-table tr:last-child td { border-bottom: none; }
    .info-table td:first-child { color: #666; width: 40%; font-weight: 500; padding-right: 10px; }
    .info-table td:last-child { color: #222; font-weight: 600; text-align: right; width: 60%; }
    .total-row td { font-size: 16px; font-weight: 700; color: #1a1a2e; padding-top: 12px !important; border-top: 2px solid #c41e3a !important; border-bottom: none !important; }
    .btn { display: inline-block; padding: 12px 24px; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; border-radius: 6px; color: #ffffff; background: linear-gradient(135deg, #c41e3a 0%, #a01830 100%); box-shadow: 0 4px 12px rgba(196,30,58,0.3); transition: all 0.3s ease; max-width: 100%; text-align: center; }
    .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(196,30,58,0.4); }
    .footer { padding: 20px; border-top: 1px solid #e8e8e8; background-color: #fafbfc; font-size: 11px; color: #888; line-height: 1.8; text-align: center; }
    .footer a { color: #c41e3a; text-decoration: none; font-weight: 500; }
    .status-badge { display: inline-block; padding: 10px 20px; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; border-radius: 6px; color: #ffffff; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); margin: 12px 0; }
    .greeting-box { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-left: 4px solid #c41e3a; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 20px; }
    .highlight { color: #c41e3a; font-weight: 700; }
    
    /* Mobile responsive styles */
    @media screen and (max-width: 480px) {
        .wrapper { padding: 10px 8px; }
        .container { border-radius: 8px; }
        .header { padding: 24px 16px 20px; }
        .header h1 { font-size: 12px; letter-spacing: 4px; }
        .content { padding: 20px 16px; font-size: 14px; line-height: 1.6; }
        .section-title { font-size: 10px; margin-top: 20px; margin-bottom: 10px; }
        .info-table tr td { padding: 8px 0; font-size: 13px; }
        .info-table td:first-child { width: 35%; }
        .info-table td:last-child { width: 65%; }
        .total-row td { font-size: 15px; }
        .btn { padding: 12px 20px; font-size: 11px; letter-spacing: 1px; display: block; width: 100%; }
        .footer { padding: 16px; font-size: 10px; }
        .greeting-box { padding: 12px 16px; }
    }
    
    @media screen and (max-width: 360px) {
        .content { padding: 16px 12px; }
        .info-table td:first-child, .info-table td:last-child { display: block; width: 100%; text-align: left; }
        .info-table td:last-child { padding-top: 4px; font-weight: 600; }
    }
`;

// Helper function to format location keys to human-readable names (bilingual FR/EN)
const formatLocation = (locationKey, lang = 'fr') => {
    if (!locationKey) return '';
    const [city, location] = locationKey.split('_');
    
    // Normalize language code (handle 'en-US', 'en-GB', etc.)
    const normalizedLang = lang?.toLowerCase().startsWith('en') ? 'en' : 'fr';
    
    // Bilingual city names
    const cityNames = {
        fr: {
            casablanca: 'Casablanca',
            marrakech: 'Marrakech',
            rabat: 'Rabat',
            tangier: 'Tanger',
            agadir: 'Agadir',
            fes: 'Fès'
        },
        en: {
            casablanca: 'Casablanca',
            marrakech: 'Marrakech',
            rabat: 'Rabat',
            tangier: 'Tangier',
            agadir: 'Agadir',
            fes: 'Fez'
        }
    };
    
    // Bilingual location types
    const locationTypes = {
        fr: {
            airport: 'Aéroport',
            cityCenter: 'Centre-ville',
            city: 'Centre-ville',
            trainStation: 'Gare',
            train: 'Gare'
        },
        en: {
            airport: 'Airport',
            cityCenter: 'City Center',
            city: 'City Center',
            trainStation: 'Train Station',
            train: 'Train Station'
        }
    };
    
    const cityName = cityNames[normalizedLang]?.[city] || cityNames['fr'][city] || city.charAt(0).toUpperCase() + city.slice(1);
    const locationType = locationTypes[normalizedLang]?.[location] || locationTypes['fr'][location] || location.charAt(0).toUpperCase() + location.slice(1);
    return `${cityName} - ${locationType}`;
};

// 1. Notification agence - nouvelle réservation - Bilingual (FR/EN)
exports.sendNewBookingNotification = async (bookingData, carDetails) => {
    try {
        console.log('📧 sendNewBookingNotification called with language:', bookingData.language);
        const transporter = createTransporter();
        const agencyEmail = process.env.AGENCY_EMAIL || process.env.EMAIL_USER;
        const { first_name, last_name, email, phone, pickup_location, dropoff_location, pickup_date, return_date, total_price, notes, language = 'fr' } = bookingData;
        
        // Determine language (default to French)
        const lang = language === 'en' ? 'en' : 'fr';
        const isEnglish = lang === 'en';

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
            <h1>Autosam</h1>
        </div>

        <div class="content">
            <div class="greeting-box">
                <p class="section-title" style="margin-top:0;">${isEnglish ? 'New Reservation Request' : 'Nouvelle demande de réservation'}</p>
                <p style="color:#555; font-size:14px; margin:0;">${isEnglish 
                    ? 'A customer has submitted a request. Please contact them to confirm.' 
                    : 'Un client vient de soumettre une demande. Veuillez le contacter pour confirmer.'}</p>
            </div>

            <div class="divider-thick"></div>

            <p class="section-title">${isEnglish ? 'Customer' : 'Client'}</p>
            <table class="info-table">
                <tr><td>${isEnglish ? 'Name' : 'Nom'}</td><td>${first_name} ${last_name}</td></tr>
                <tr><td>Email</td><td>${email}</td></tr>
                <tr><td>${isEnglish ? 'Phone' : 'Téléphone'}</td><td>${phone}</td></tr>
            </table>

            <hr class="divider">

            <p class="section-title">${isEnglish ? 'Vehicle' : 'Véhicule'}</p>
            ${carDetails ? `
            <table class="info-table">
                <tr><td>${isEnglish ? 'Model' : 'Modèle'}</td><td>${carDetails.name} (${carDetails.year})</td></tr>
                <tr><td>${isEnglish ? 'Price / day' : 'Prix / jour'}</td><td>${carDetails.price_per_day} MAD</td></tr>
            </table>
            ` : `<p style="color:#aaa; font-size:13px;">${isEnglish ? 'Information not available' : 'Informations non disponibles'}</p>`}

            <hr class="divider">

            <p class="section-title">${isEnglish ? 'Reservation' : 'Réservation'}</p>
            <table class="info-table">
                <tr><td>${isEnglish ? 'Pick-up location' : 'Prise en charge'}</td><td>${formatLocation(pickup_location, lang)}</td></tr>
                <tr><td>${isEnglish ? 'Return location' : 'Restitution'}</td><td>${formatLocation(dropoff_location, lang)}</td></tr>
                <tr><td>${isEnglish ? 'Pick-up date' : 'Date départ'}</td><td>${new Date(pickup_date).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR')}</td></tr>
                <tr><td>${isEnglish ? 'Return date' : 'Date retour'}</td><td>${new Date(return_date).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR')}</td></tr>
                ${notes ? `<tr><td>${isEnglish ? 'Notes' : 'Notes'}</td><td>${notes}</td></tr>` : ''}
                <tr class="total-row"><td>${isEnglish ? 'Estimated total' : 'Total estimé'}</td><td>${total_price} MAD</td></tr>
            </table>

            <div style="margin-top: 32px; text-align: center;">
                <a href="tel:${phone}" class="btn">${isEnglish ? 'Call customer' : 'Appeler le client'}</a>
            </div>
        </div>

        <div class="footer">
            <p>© ${new Date().getFullYear()} Autosam — ${isEnglish ? 'Automatic notification' : 'Notification automatique'}</p>
        </div>

    </div>
</div>
</body>
</html>`;

        await transporter.sendMail({
            from: `"Autosam" <${process.env.EMAIL_USER}>`,
            to: agencyEmail,
            subject: isEnglish 
                ? `New reservation — ${first_name} ${last_name}` 
                : `Nouvelle réservation — ${first_name} ${last_name}`,
            html: emailContent
        });

        console.log(`✅ Email agence envoyé : ${agencyEmail} (${lang})`);
        return { success: true };
    } catch (error) {
        console.error('❌ Erreur email agence:', error);
        return { success: false, error: error.message };
    }
};

// 2. Confirmation client - Bilingual (FR/EN)
exports.sendBookingConfirmation = async (bookingData) => {
    try {
        const transporter = createTransporter();
        const { email, first_name, car_name, pickup_date, return_date, pickup_location, dropoff_location, total_price, language = 'fr' } = bookingData;
        
        // Support both camelCase and snake_case field names
        const actualDropoffLocation = dropoff_location || bookingData.dropoffLocation;
        const actualPickupLocation = pickup_location || bookingData.pickupLocation;
        
        // Debug logging
        console.log('📧 sendBookingConfirmation - Language:', language);
        console.log('📧 Pickup location:', actualPickupLocation);
        console.log('📧 Dropoff location:', actualDropoffLocation);
        
        // Determine language (default to French)
        const lang = language === 'en' ? 'en' : 'fr';
        const isEnglish = lang === 'en';
        
        // Normalize language code for formatLocation
        const normalizedLang = lang?.toLowerCase().startsWith('en') ? 'en' : 'fr';

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
            <h1>Autosam</h1>
        </div>

        <div class="content">
            <div class="greeting-box">
                <p style="font-size:17px; font-weight:600; color:#111; margin-bottom:10px;">${isEnglish ? 'Hello' : 'Bonjour'} <span class="highlight">${first_name}</span>,</p>
                <p style="color:#555; font-size:14px; margin:0;">${isEnglish 
                    ? 'Your reservation request has been received. We will contact you shortly to confirm your rental.' 
                    : 'Votre demande de réservation a bien été reçue. Nous vous contacterons dans les plus brefs délais pour confirmer votre location.'}</p>
            </div>

            <div class="divider-thick"></div>

            <p class="section-title">${isEnglish ? 'Summary' : 'Récapitulatif'}</p>
            <table class="info-table">
                <tr><td>${isEnglish ? 'Vehicle' : 'Véhicule'}</td><td>${car_name}</td></tr>
                <tr><td>${isEnglish ? 'Pick-up date' : 'Date de départ'}</td><td>${new Date(pickup_date).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR')}</td></tr>
                <tr><td>${isEnglish ? 'Return date' : 'Date de retour'}</td><td>${new Date(return_date).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR')}</td></tr>
                <tr><td>${isEnglish ? 'Pick-up location' : 'Lieu de prise en charge'}</td><td>${formatLocation(actualPickupLocation, normalizedLang)}</td></tr>
                <tr><td>${isEnglish ? 'Return location' : 'Lieu de restitution'}</td><td>${formatLocation(actualDropoffLocation, normalizedLang)}</td></tr>
                <tr class="total-row"><td>${isEnglish ? 'Total' : 'Total'}</td><td>${total_price} MAD</td></tr>
            </table>

            <div style="margin-top: 32px; text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings" class="btn">${isEnglish ? 'View my reservation' : 'Voir ma réservation'}</a>
            </div>
        </div>

        <div class="footer">
            <p>${isEnglish ? 'Thank you for choosing Autosam' : 'Merci de faire confiance à Autosam'}</p>
            <p>${isEnglish ? 'Questions?' : 'Questions ?'} <a href="mailto:contact@autosam.ma">contact@autosam.ma</a></p>
            <p style="margin-top:8px;">© ${new Date().getFullYear()} Autosam</p>
        </div>

    </div>
</div>
</body>
</html>`;

        await transporter.sendMail({
            from: `"Autosam" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: isEnglish 
                ? `Reservation request received — Autosam` 
                : `Demande de réservation reçue — Autosam`,
            html: emailContent
        });

        console.log(`✅ Email confirmation envoyé : ${email} (${lang})`);
        return true;
    } catch (error) {
        console.error('❌ Erreur email confirmation:', error);
        return false;
    }
};

// 3. Mise à jour statut - Bilingual (FR/EN)
exports.sendStatusUpdate = async (bookingData, newStatus) => {
    try {
        const transporter = createTransporter();
        const { email, first_name, car_name, language = 'fr' } = bookingData;
        
        // Determine language (default to French)
        const lang = language === 'en' ? 'en' : 'fr';
        const isEnglish = lang === 'en';

        const statusLabels = {
            fr: {
                confirmed: 'Confirmée',
                cancelled: 'Annulée',
                completed: 'Terminée',
                pending: 'En attente'
            },
            en: {
                confirmed: 'Confirmed',
                cancelled: 'Cancelled',
                completed: 'Completed',
                pending: 'Pending'
            }
        };

        const label = statusLabels[lang][newStatus] || (isEnglish ? 'Updated' : 'Mise à jour');

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
            <h1>Autosam</h1>
        </div>

        <div class="content">
            <div class="greeting-box">
                <p style="font-size:17px; font-weight:600; color:#111; margin-bottom:10px;">${isEnglish ? 'Hello' : 'Bonjour'} <span class="highlight">${first_name}</span>,</p>
                <p style="color:#555; font-size:14px; margin:0;">${isEnglish 
                    ? `The status of your reservation for vehicle <strong style="color:#111;">${car_name}</strong> has been updated.`
                    : `Le statut de votre réservation pour le véhicule <strong style="color:#111;">${car_name}</strong> a été mis à jour.`}</p>
            </div>

            <div class="divider-thick"></div>

            <p class="section-title">${isEnglish ? 'Reservation Status' : 'Statut de la réservation'}</p>
            <span class="status-badge">${label}</span>

            <hr class="divider">

            <div style="margin-top: 28px; text-align: center;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings" class="btn">${isEnglish ? 'View details' : 'Voir les détails'}</a>
            </div>
        </div>

        <div class="footer">
            <p>Autosam — ${isEnglish ? 'Car Rental' : 'Location de voitures'}</p>
            <p>${isEnglish 
                ? 'This email was sent automatically. Please do not reply.' 
                : 'Cet email a été envoyé automatiquement. Merci de ne pas y répondre.'}</p>
            <p style="margin-top:8px;">© ${new Date().getFullYear()} Autosam</p>
        </div>

    </div>
</div>
</body>
</html>`;

        await transporter.sendMail({
            from: `"Autosam" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: isEnglish 
                ? `Reservation ${label} — Autosam`
                : `Réservation ${label} — Autosam`,
            html: emailContent
        });

        console.log(`✅ Email statut envoyé : ${email} (${lang})`);
        return true;
    } catch (error) {
        console.error('❌ Erreur email statut:', error);
        return false;
    }
};