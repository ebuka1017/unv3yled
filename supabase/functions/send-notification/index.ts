import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  type: 'recommendation' | 'match' | 'welcome';
  data?: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, type, data }: EmailRequest = await req.json();

    let htmlContent = '';
    
    switch (type) {
      case 'welcome':
        htmlContent = `
          <h1>Welcome to Cortex!</h1>
          <p>Thank you for joining our AI-powered cultural discovery platform.</p>
          <p>Get ready to discover music, movies, books, and more that perfectly match your taste!</p>
          <p>Start exploring by connecting your Spotify account and building your taste profile.</p>
        `;
        break;
        
      case 'recommendation':
        htmlContent = `
          <h1>New Recommendations for You!</h1>
          <p>We've found some exciting cultural discoveries based on your preferences:</p>
          ${data?.recommendations ? `
            <ul>
              ${data.recommendations.map((rec: any) => `
                <li><strong>${rec.name || rec.title}</strong> - ${rec.category}</li>
              `).join('')}
            </ul>
          ` : ''}
          <p>Log in to Cortex to explore these recommendations in detail!</p>
        `;
        break;
        
      case 'match':
        htmlContent = `
          <h1>You have a new Taste Twin!</h1>
          <p>Great news! Someone with similar cultural preferences wants to connect with you.</p>
          <p>Similarity Score: ${data?.similarity || 'High'}</p>
          <p>Log in to Cortex to view your match and start sharing recommendations!</p>
        `;
        break;
        
      default:
        htmlContent = '<p>You have a new notification from Cortex!</p>';
    }

    const emailResponse = await resend.emails.send({
      from: "Cortex <notifications@cortex.lovable.app>",
      to: [to],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ec4899; margin: 0;">Cortex</h1>
            <p style="color: #666; margin: 5px 0;">Your AI Cultural Companion</p>
          </div>
          
          <div style="background: #f9fafb; padding: 30px; border-radius: 12px;">
            ${htmlContent}
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #666; font-size: 14px;">
              This email was sent from Cortex. If you no longer wish to receive these emails, 
              you can update your preferences in your account settings.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});