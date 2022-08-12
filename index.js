let videos = new Map();

async function get_search_results(search_term) {
   let res = await fetch(
      `https://content-youtube.googleapis.com/youtube/v3/search?q=${search_term}&order=viewCount&maxResults=25&part=snippet&key=${process.env.YOUTUBE_API}`
   );
   let data = await res.json();
   return data.items;
}

async function get_video(id) {
   let res = await fetch(
      `https://content-youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${id}&key=${process.env.YOUTUBE_API}`
   );
   let data = await res.json();
   return data;
}

get_search_results("surfing").then((data) => {
   get_video(data[0].id.videoId).then((data) =>
      console.log(data.items[0].snippet)
   );
});
