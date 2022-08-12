let videoMap = new Map();

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
   return data.items[0];
}

async function get_comments(id) {
   let res = await fetch(
      `https://content-youtube.googleapis.com/youtube/v3/commentThreads?order=relevance&videoId=${id}&maxResults=30&part=snippet&key=${process.env.YOUTUBE_API}`
   );
   let data = await res.json();
   return data;
}

async function scrape_data(random_word, map) {
   try {
      let results = await get_search_results(random_word);
      for (let i = 0; i < results.length; i++) {
         let video = await get_video(results[i].id.videoId);
         if (video.statistics.viewCount < 1_000_000) {
            break;
         }
         let comments = await get_comments(results[i].id.videoId);
         let result = {
            description: video.snippet.description,
            likes: video.statistics.likeCount,
            viwes: video.statistics.viewCount,
            title: video.snippet.title,
            comments,
         };
         map.set(results[i].id.videoId, result);
      }
   } catch (err) {
      console.log(err);
   }
}

scrape_data("surf", videoMap).then((_) => {
   console.log(videoMap);
});
