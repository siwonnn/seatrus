export async function sendSlackWebhook(text: string) {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL
  if (slackWebhookUrl) {
    try {
      const res = await fetch(slackWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      })
      if (!res.ok) throw new Error("Error while sending feedback webhook")
    } catch (error) {
      console.error(error)
    }
  }
}