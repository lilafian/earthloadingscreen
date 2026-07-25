(async () => {
	async function get_image_url(file_name) {
		const endpoint = `https://commons.wikimedia.org/w/api.php?origin=*&action=query&titles=${encodeURIComponent(file_name)}&prop=imageinfo&iiprop=url&format=json`
		const res = await fetch(endpoint);
		const data = await res.json();
		const page = Object.values(data.query.pages)[0];
		return page.imageinfo[0].url;
	}

	async function get_random_image() {
		const res = await fetch("https://commons.wikimedia.org/w/api.php?action=query&list=random&rnnamespace=6&rnlimit=1&format=json&origin=*").then(r => r.json());

		const title = res.query.random[0].title;

		const info = await fetch(
			`https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=revisions&rvprop=content&rvslots=main&format=json&origin=*`
		).then(r => r.json());

		const page = Object.values(info.query.pages)[0];

		const regex = /\|\s*description\s*=\s*(?:\{\{[^|]+\|(?:\d+=)?([\s\S]*?)\}\}|([\s\S]*?))\s*(?=\n\s*\|[^|])/;
		const match = page.revisions?.[0]?.slots?.main?.["*"].match(regex);

		return {
			title: title,
			description: (match?.[1] || match?.[2] || "").trim()
		};
	}

	async function update_loading_screen_content() {
		const random_image = await get_random_image();
		const image_url = await get_image_url(random_image.title);

		const image = document.getElementById("image");
		image.src = image_url;

		const desc = document.getElementById("desc");
		desc.innerHTML = random_image.description;
	}

	setInterval(update_loading_screen_content, 10000);
	update_loading_screen_content();

})();
