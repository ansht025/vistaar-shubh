import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SENDER_EMAIL

def send_otp_email(to_email: str, otp_code: str):
    """
    Sends an OTP email using smtplib.
    """
    if not SMTP_PASSWORD or SMTP_PASSWORD == "your-app-password-here":
        print(f"WARNING: SMTP_PASSWORD not set. Would have sent OTP {otp_code} to {to_email}")
        return False
        
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Your VistaarWater Login Code"
        msg["From"] = f"VistaarWater <{SENDER_EMAIL}>"
        msg["To"] = to_email

        html_content = f"""
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #00b894;">VistaarWater</h2>
            </div>
            <div style="background-color: #f9f9f9; border-radius: 8px; padding: 30px; text-align: center;">
              <h3 style="margin-top: 0;">Your Verification Code</h3>
              <p>Please use the following 6-digit code to complete your login/signup process.</p>
              <div style="background-color: #fff; border: 2px dashed #00b894; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #00b894;">{otp_code}</span>
              </div>
              <p style="font-size: 14px; color: #666;">This code is valid for 10 minutes. Do not share this code with anyone.</p>
            </div>
          </body>
        </html>
        """
        
        part = MIMEText(html_content, "html")
        msg.attach(part)

        # Connect to SMTP server
        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False
