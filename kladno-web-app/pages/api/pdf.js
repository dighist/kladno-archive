import axios from 'axios'

export default async function handler(req, res) {
  const url = req.query.url // Get the URL of the PDF from the query string
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer', // Force to receive data as a Stream
    })
    const buffer = Buffer.from(response.data, 'binary')
    res.setHeader('Content-Type', 'application/pdf')
    res.send(buffer)
  } catch (error) {
    res.status(error.status || 400).end(error.message)
  }
}
