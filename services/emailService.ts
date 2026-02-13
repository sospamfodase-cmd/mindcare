import { BlogPost } from '../types';

interface SendEmailParams {
  apiKey: string;
  to: string[];
  subject: string;
  html: string;
}

export const emailService = {
  sendEmail: async ({ apiKey, to, subject, html }: SendEmailParams) => {
    // Use local proxy path in development to avoid CORS
    // In production, this should point to your own backend endpoint or serverless function
    const isDev = import.meta.env.DEV;
    const url = isDev ? '/api/resend/emails' : 'https://api.resend.com/emails';

    // Resend free tier limits to 1 email per request usually, or batch.
    // However, sending to multiple recipients in "to" field works but shows all emails to everyone if not careful (use bcc).
    // For privacy, we should send individual emails or use 'bcc'.
    // Resend recommends 'to' for transactional, 'bcc' for bulk if simple.
    // But best practice for newsletters is individual sends or using their 'audiences' feature (which is more complex).
    // For this simple implementation, we will use BCC to hide recipients, sending TO the sender or a noreply address.
    
    // Note: Resend Free Tier requires verifying the sending domain. 
    // If testing without domain, you can only send to your own email.
    // This is a constraint the user will face.
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          from: 'Espaço Mindcare <onboarding@resend.dev>', // Default Resend test sender
          to: ['delivered@resend.dev'], // Dummy 'to'
          bcc: to, // Actual recipients hidden
          subject: subject,
          html: html
        })
      });

      if (!response.ok) {
        const error = await response.json();
        
        // Handle Resend Free Tier Restriction: "You can only send testing emails to your own email address..."
        if (error.message && error.message.includes('only send testing emails to your own email address')) {
           const match = error.message.match(/\(([^)]+)\)/);
           const allowedEmail = match ? match[1] : null;

           if (allowedEmail) {
             console.warn(`Resend Free Tier Restriction: Retrying send to allowed test email only: ${allowedEmail}`);
             // Retry sending ONLY to the allowed email
             const retryResponse = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                  from: 'Espaço Mindcare <onboarding@resend.dev>',
                  to: [allowedEmail], 
                  subject: `[TEST MODE] ${subject}`,
                  html: `<p><strong>Aviso: Este e-mail foi enviado apenas para você porque o domínio não foi verificado no Resend.</strong></p><hr/>${html}`
                })
             });

             if (retryResponse.ok) {
                 return { ...await retryResponse.json(), warning: 'Email sent to test address ONLY (Domain not verified)' };
             }
           }
        }

        throw new Error(error.message || 'Failed to send email');
      }

      return await response.json();
    } catch (error) {
      console.error('Email service error:', error);
      throw error;
    }
  },

  generateNewsletterTemplate: (posts: BlogPost[]) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #112b42; background-color: #f0e3da; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 8px; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0, 53, 95, 0.1); }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f0e3da; padding-bottom: 20px; }
          .logo { color: #00355f; font-size: 26px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
          .subtitle { color: #6387ab; font-size: 16px; margin-top: 5px; }
          .post-card { margin-bottom: 30px; border-bottom: 1px solid #f0e3da; padding-bottom: 30px; }
          .post-title { font-size: 22px; color: #00355f; margin-bottom: 10px; font-weight: bold; }
          .post-meta { font-size: 14px; color: #6387ab; margin-bottom: 10px; text-transform: uppercase; font-size: 12px; font-weight: bold; }
          .post-excerpt { color: #3a6e99; margin-bottom: 20px; }
          .button { display: inline-block; padding: 12px 24px; background-color: #bd8c48; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; transition: background-color 0.3s; }
          .button:hover { background-color: #a07236; }
          .footer { text-align: center; font-size: 12px; color: #6387ab; margin-top: 40px; border-top: 1px solid #f0e3da; padding-top: 20px; }
          h2 { color: #00355f; border-left: 4px solid #bd8c48; padding-left: 15px; margin-bottom: 25px; }
        </style>
      </head>
      <body>
        <div style="background-color: #f0e3da; padding: 20px;">
          <div class="container">
            <div class="header">
              <div class="logo">Espaço Mindcare Weekly</div>
              <p class="subtitle">Seus insights semanais sobre saúde mental e bem-estar.</p>
            </div>
            
            <h2>Destaques da Semana</h2>
            
            ${posts.map(post => `
              <div class="post-card">
                <div class="post-title">${post.title}</div>
                <div class="post-meta">${post.date} • ${post.category}</div>
                <div class="post-excerpt">${post.excerpt}</div>
                <a href="https://dr-bianca-amaral-mindcare.vercel.app/blog/${post.id}" class="button">Ler Completo</a>
              </div>
            `).join('')}
            
            <div class="footer">
              <p>Você está recebendo este e-mail porque se inscreveu na newsletter do Espaço Mindcare.</p>
              <p>© ${new Date().getFullYear()} Dra. Bianca Amaral. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  generateNewPostTemplate: (post: BlogPost) => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.6; color: #112b42; background-color: #f0e3da; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; border-radius: 8px; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0, 53, 95, 0.1); }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f0e3da; padding-bottom: 20px; }
          .logo { color: #00355f; font-size: 26px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
          .subtitle { color: #6387ab; font-size: 16px; margin-top: 5px; }
          .post-title { font-size: 26px; color: #00355f; margin-bottom: 15px; font-weight: bold; line-height: 1.3; }
          .post-meta { font-size: 14px; color: #6387ab; margin-bottom: 25px; text-transform: uppercase; font-size: 12px; font-weight: bold; }
          .post-excerpt { color: #3a6e99; margin-bottom: 30px; font-size: 18px; line-height: 1.8; }
          .button { display: inline-block; padding: 14px 28px; background-color: #bd8c48; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px; }
          .footer { text-align: center; font-size: 12px; color: #6387ab; margin-top: 40px; border-top: 1px solid #f0e3da; padding-top: 20px; }
          .image-preview { width: 100%; max-height: 350px; object-fit: cover; border-radius: 4px; margin-bottom: 25px; border: 1px solid #f0e3da; }
        </style>
      </head>
      <body>
        <div style="background-color: #f0e3da; padding: 20px;">
          <div class="container">
            <div class="header">
              <div class="logo">Novo Artigo Publicado!</div>
              <p class="subtitle">Dra. Bianca Amaral acabou de postar um novo conteúdo.</p>
            </div>
            
            <img src="${post.image}" alt="${post.title}" class="image-preview" />
            
            <div class="post-title">${post.title}</div>
            <div class="post-meta">${post.date} • ${post.category}</div>
            <div class="post-excerpt">${post.excerpt}</div>
            
            <div style="text-align: center;">
              <a href="https://dr-bianca-amaral-mindcare.vercel.app/blog/${post.id}" class="button">Ler Artigo Completo</a>
            </div>
            
            <div class="footer">
              <p>Você está recebendo este e-mail porque se inscreveu na newsletter do Espaço Mindcare.</p>
              <p>© ${new Date().getFullYear()} Dra. Bianca Amaral. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
};
