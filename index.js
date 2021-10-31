// initialize array of links
const links = [
  {"name": "MyPortfolio", "url": "https://rajpratyush.github.io/"},
  {"name": "MyGithub", "url": "https://github.com/rajpratyush"},
  {"name": "MyLinkedIn", "url": "https://linkedin.com/in/rajpratyush/"},
]

// url for static html page
const host = "https://static-links-page.signalnerve.workers.dev"

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, links))
})

/**
 * Respond to the request
 * @param {Request, Links} request
 */
async function handleRequest(request, links) {   
  // check if is /links or not
  if(request.url === "https://my-worker.rajpratyush.workers.dev/") {
    // fetch static html page and process
    const response = await fetch(host)
    const result = await gatherResponse(response)
    let staticHtml = new Response(result)
    // use rewriter to enhance page
    const rewriter = new HTMLRewriter().on("*", new LinksTransformer())
    let formattedHtml = rewriter.transform(staticHtml)
    // reformat page and return
    const formattedResult = await gatherResponse(formattedHtml)
    return new Response(formattedResult, {
      headers: {
        "content-type": "text/html;charset=UTF-8"
      }
    })
  } else if(request.url === "https://my-worker.rajpratyush.workers.dev/links") {
    const json = JSON.stringify(links, null, 2)
    return new Response(json, {
      headers: {
        "content-type": "application/json;charset=UTF-8"
      }
    })
  }
}

/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}

// class to modify html
class LinksTransformer {
  async element(element) {
    if(element.tagName === 'div' && element.getAttribute('id') === "links") {
      for(const link of links) {
        const { url, name } = link
        element.append(`<a href=${url}>${name}</a>`, {html: true})      
      } 
    } else if(element.tagName === 'div' && element.getAttribute('id') === "profile") {
      element.removeAttribute('style')
    } else if(element.tagName === 'img') {
      element.setAttribute('src', 'https://cdn2.iconfinder.com/data/icons/teen-people-face-avatar-6/500/teen_109-512.png')
    } else if(element.tagName === 'h1') {
      element.setInnerContent("ian038")
    } else if(element.tagName === 'div' && element.getAttribute('id') === "social") {
      const socialContent = `<a href="https://slack.com/">
                              <img height="32" width="32" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/slack.svg" />
                              </a>
                              `
      element.removeAttribute('style')
      element.setInnerContent(socialContent, {html: true})
    } else if(element.tagName === 'title') {
        element.setInnerContent("Chai Ian Phua")
    } else if(element.tagName === 'body' && element.getAttribute('class') === 'bg-gray-900') {
        element.setAttribute('class', 'bg-gray-500')
    }
  }
}















