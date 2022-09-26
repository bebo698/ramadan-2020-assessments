const listofvideoElm = document.getElementById('listofrequests');

function getSingleVideoReq(vidInfo,isprepend=false) {


  const videoReqcontainerElm = document.createElement('div');
  videoReqcontainerElm.innerHTML = `
<h1 class="mb-4">List of requested videos</h1>
      <div id="listOfRequests">
        <div class="card mb-3">
          <div class="card-body d-flex justify-content-between flex-row">
            <div class="d-flex flex-column">
              <h3> ${vidInfo.topic_title}</h3>
              <p class="text-muted mb-2">${vidInfo.topic_details}</p>
              <p class="mb-0 text-muted">
              ${vidInfo.expected_result &&
    `<strong>Expected results:</strong> ${vidInfo.expected_result}`
    }      
              </p>
            </div>
            <div class="d-flex flex-column text-center">
              <a id="votes_ups_${vidInfo._id}" class="btn btn-link">🔺</a>
              <h3 id="score_vote_${vidInfo._id}">${vidInfo.votes.ups - vidInfo.votes.downs} </h3>
              <a  id="votes_down_${vidInfo._id}" class="btn btn-link">🔻</a>
            </div>
          </div>
          <div class="card-footer d-flex flex-row justify-content-between">
            <div>
              <span class="text-info">${vidInfo.status.toUpperCase()}</span>
              &bullet; added by <strong>${vidInfo.author_name}</strong> on
              <strong>${vidInfo.submit_date}</strong>
            </div>
            <div
              class="d-flex justify-content-center flex-column 408ml-auto mr-2"
            >
              <div class="badge badge-success">
                ${vidInfo.target_level}
              </div>
            </div>
          </div>
`;
  listofvideoElm.appendChild(videoReqcontainerElm)
  const voteUpsElm = document.getElementById(`votes_ups_${vidInfo._id}`);
  const voteDowElm = document.getElementById(`votes_down_${vidInfo._id}`);
  const scoreVoteElm = document.getElementById(`score_vote_${vidInfo._id}`);
  voteUpsElm.addEventListener('click', (e) => {
    fetch('http://localhost:7777/video-request/vote', {
      method: 'PUT',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({ id: vidInfo._id, vote_type: 'ups' }),
    })
      .then((bolb) => bolb.json())
      .then((data) => {
        scoreVoteElm.innerHTML = data.votes.ups - data.votes.downs;
      });
  });

  voteDowElm.addEventListener('click', (e) => {
    fetch('http://localhost:7777/video-request/vote', {
      method: 'PUT',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify({ id: vidInfo._id, vote_type: 'downs' }),
    })
      .then((bolb) => bolb.json())
      .then((data) => {
        scoreVoteElm.innerHTML = data.votes.ups - data.votes.downs;
      });
  });
}
function loadAllreqs(sort_by = 'newFirst') 
{
  fetch(`http://localhost:7777/video-request?sort_by=${sort_by}`).then((blob) => blob.json()).then(data => {
    listofvideoElm.innerHTML='';
  data?.forEach(vidInfo => {

    getSingleVideoReq(vidInfo);
  });
});

}
document.addEventListener('DOMContentLoaded', function () {
  const formVideoReq = document.getElementById('formVideoReq');
   
  const sortbtelms = document.querySelectorAll ('[id*=sort_by_]');
  // console.log(sortbtelms);
  loadAllreqs() 

  sortbtelms.forEach(elm => {
    elm.addEventListener('click',function (e){
      e.preventDefault();
      const sort_by = this.querySelector('input');
       loadAllreqs(sort_by.value) ;
      this.classList.add('active');
      if (sort_by.value==='topvotedfirst')
      {
        document.getElementById('sort_by_new').classList.remove('active')
      }else{
        document.getElementById('sort_by_top').classList.remove('active')

      }

     })
   
  })
  

  formVideoReq.addEventListener('submit', (e) => {
    e.preventDefault();
    const formdata = new FormData(formVideoReq); 
    fetch('http://localhost:7777/video-request', { method: 'POST', body: formdata })
      .then((bold) => bold.json())
      .then((data) => {
        console.log(data);
        getSingleVideoReq(data);
      })
  })
});