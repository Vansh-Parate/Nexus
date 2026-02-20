import nodemailer from 'nodemailer'

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env

let transporter = null

if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })
}

export async function sendPitchEmail({
  to,
  investorName,
  startupName,
  founderName,
  sector,
  pitch,
  pitchDeckUrl,
  message,
}) {
  if (!transporter || !to) {
    console.warn('SMTP not configured or missing recipient; skipping email.')
    return
  }

  const fromAddress = SMTP_FROM || SMTP_USER

  const subject = `New pitch from ${startupName || 'a startup'}`

  const lines = []
  lines.push(`Hi ${investorName || 'there'},`)
  lines.push('')
  lines.push(
    `${startupName || 'A startup'} in ${sector || 'your focus area'} has sent you a pitch via VEGA.`
  )
  if (founderName) {
    lines.push(`Founder: ${founderName}`)
  }
  lines.push('')
  if (pitch) {
    lines.push('Pitch:')
    lines.push(pitch)
    lines.push('')
  }
  if (pitchDeckUrl) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const fullUrl = pitchDeckUrl.startsWith('http') ? pitchDeckUrl : `${baseUrl}${pitchDeckUrl}`
    lines.push(`Pitch Deck: ${fullUrl}`)
    lines.push('')
  }
  if (message) {
    lines.push('Personal note from founder:')
    lines.push(message)
    lines.push('')
  }
  lines.push('Log in to VEGA to review the full details.')

  const text = lines.join('\n')

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    text,
  })
}

