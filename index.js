/*
Name: Ashley Teow
Date: 04/18/2020
Project: Cloudflare Remote Full-Stack Development Internship Application

This application fetches a URL and returns the response as a JSON object, that contains
the two URL variants of the same website. Depending on which variant is selected,
the HTML displayed will either display differently, as you wiill be able to see from the title,
Variant 1 or Variant 2. 
*/

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// Custom class responsible for setting the content of the element to handle.
class ElementHandler {
	constructor(elem) {
		this.elem = elem
	}

	element(element) {
		element.setInnerContent(this.elem);
	}
}


// Custom class responsible for replacing website links for the CTA buttons
class AttrRewriter {
	constructor(attr) {
    	this.attrName = attr;
    }
 
	element(element) {
		let attribute = element.getAttribute(this.attrName)
		if (attribute) {
			element.setAttribute(
				this.attrName,
				attribute.replace('https://cloudflare.com', 'https://www.linkedin.com/in/ashleyteow/')
			)
		}
	}
}

async function handleRequest(request) {
	let urlReq = await fetch('https://cfw-takehome.developers.workers.dev/api/variants')
	.then((response) => {
		return response.json();
	})
	let variants = urlReq["variants"];
	let selectedVariant;
	let cookies = request.headers.get("Cookie") || "";

	if (cookies.includes("variant=0")) {
		selectedVariant = 0;
	} else if (cookies.includes("variant=1")) {
		selectedVariant = 1;
	} else {
		selectedVariant = Math.round(Math.random());
	}
	
	let response = await fetch(variants[selectedVariant])
	.then((response) => {
		return response;
	})


	// Display HTML in A/B fashion, depending on variant 
	if (variant == 0) { 
		response = new HTMLRewriter().on('title', new ElementHandler('Ashley Teow')).transform(response);
		response = new HTMLRewriter().on('h1#title', new ElementHandler('Variant 1')).transform(response);
		response = new HTMLRewriter().on('p#description', new ElementHandler('This is a variant 1 response')).transform(response);
		response = new HTMLRewriter().on('a#url', new ElementHandler('Connect with me on Linkedin!')).transform(response);
		response = new HTMLRewriter().on('a', new AttrRewriter('href')).transform(response);
		response.headers.set("Set-Cookie", "variant=0");
	} else { 
		response = new HTMLRewriter().on('title', new ElementHandler('Ashley Teow')).transform(response);
		response = new HTMLRewriter().on('h1#title', new ElementHandler('Variant 2')).transform(response);
		response = new HTMLRewriter().on('p#description', new ElementHandler('This is a variant 2 response')).transform(response);
		response = new HTMLRewriter().on('a#url', new ElementHandler('Are you interested?')).transform(response);
		response = new HTMLRewriter().on('a', new AttrRewriter('href')).transform(response);
		response.headers.set("Set-Cookie", "variant=1");
	}
	return response;
}



