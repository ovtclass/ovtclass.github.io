const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {
    const pageToScreenshot = "https://www.google.hu/" //JSON.parse(event.body).pageToScreenshot;
    /*if (!pageToScreenshot) return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Page URL not defined' })
    }*/
    const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
    });
    
    const page = await browser.newPage();
    await page.goto(pageToScreenshot, { waitUntil: "networkidle2" });
    const pdf = await page.pdf({ /*path: "hsa.pdf",*/ format: 'A4' });
    await browser.close();
  
    let response = {
        statusCode: 200,
        headers: {
          'Content-type': 'application/pdf',
          'content-disposition': 'attachment; filename=test.pdf',
        },
        body: pdf.toString('base64'),
        isBase64Encoded: true
      };
    return response;
}
