import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))

# Destinataires fixes
ADMIN_EMAILS = [
    "zaineb.elbouromi@external.stellantis.com",
    "laila.azzouzi@external.stellantis.com",
    "douae.hafidi18@gmail.com"
]

def send_notification_email(
    type_demande: str,
    reference: str,
    description: str,
    user_nom: str,
    user_prenom: str,
    user_email: str
):
    try:
        # Corps du mail HTML
        if type_demande == "creation":
            sujet = f"[GFST] Nouvelle demande de création — {reference}"
            couleur = "#00C6A2"
            titre = "Nouvelle demande de création de standard"
            icone = "📋"
        else:
            sujet = f"[GFST] Demande de mise à jour — {reference}"
            couleur = "#3D8EF5"
            titre = "Demande de mise à jour de standard"
            icone = "✏️"

        html = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {{ font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
    .header {{ background: {couleur}; padding: 24px 30px; }}
    .header h1 {{ color: #fff; margin: 0; font-size: 20px; }}
    .header p {{ color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px; }}
    .body {{ padding: 30px; }}
    .info-row {{ display: flex; border-bottom: 1px solid #eee; padding: 12px 0; }}
    .info-label {{ width: 160px; font-weight: bold; color: #555; font-size: 14px; flex-shrink: 0; }}
    .info-value {{ color: #333; font-size: 14px; }}
    .badge {{ display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: {couleur}20; color: {couleur}; }}
    .footer {{ background: #f9f9f9; padding: 16px 30px; border-top: 1px solid #eee; text-align: center; }}
    .footer p {{ color: #999; font-size: 12px; margin: 0; }}
    .btn {{ display: inline-block; padding: 12px 24px; background: {couleur}; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{icone} {titre}</h1>
      <p>Plateforme GFST — Global FaSteners Team</p>
    </div>
    <div class="body">
      <p style="color:#555;font-size:14px;margin-bottom:20px;">
        Une nouvelle demande a été soumise sur la plateforme GFST et nécessite votre attention.
      </p>

      <div class="info-row">
        <div class="info-label">Type</div>
        <div class="info-value"><span class="badge">{type_demande.upper()}</span></div>
      </div>
      <div class="info-row">
        <div class="info-label">Référence</div>
        <div class="info-value"><strong>{reference}</strong></div>
      </div>
      <div class="info-row">
        <div class="info-label">Description</div>
        <div class="info-value">{description}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Soumis par</div>
        <div class="info-value">{user_prenom} {user_nom}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Email</div>
        <div class="info-value">{user_email}</div>
      </div>

      <div style="text-align:center;">
        <a href="http://localhost:3000/admin" class="btn">
          Voir sur la plateforme GFST →
        </a>
      </div>
    </div>
    <div class="footer">
      <p>Cet email a été envoyé automatiquement par la plateforme GFST</p>
      <p style="margin-top:4px;">© 2026 GFST — Global FaSteners Team · Stellantis</p>
    </div>
  </div>
</body>
</html>
"""

        # Envoyer à chaque destinataire
        for dest in ADMIN_EMAILS:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = sujet
            msg["From"] = f"GFST Platform <{MAIL_FROM}>"
            msg["To"] = dest

            msg.attach(MIMEText(html, "html"))

            with smtplib.SMTP(MAIL_SERVER, MAIL_PORT) as server:
                server.ehlo()
                server.starttls()
                server.login(MAIL_USERNAME, MAIL_PASSWORD)
                server.sendmail(MAIL_FROM, dest, msg.as_string())

        print(f"✅ Emails envoyés pour {reference}")
        return True

    except Exception as e:
        print(f"❌ Erreur email: {str(e)}")
        return False