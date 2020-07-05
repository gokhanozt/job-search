import '../styles/index.scss';
'use strict';
//variables
const search = document.getElementById('search');
const matchList = document.getElementById('match-list');
const searchBtn = document.getElementById('search-button');

//fetching
const searchJobs = async searchText => {
    const res = await fetch('https://api.joblocal.de/v4/search-jobs?search.query=' + searchText);
    const jobs = await res.json();

   if(jobs.meta.pagination.count > 0)
   {
    const matches = jobs.included.filter(job => {
        const regex = new RegExp(`${searchText}`, 'gi');
        return job.attributes.title.match(regex) || job.attributes.company.name.match(regex);
    });
    outputHtml(matches);
   }
   else{
       //no result case
    matchList.innerHTML = '<p>0 job found.</p>';
   }
};

//show results in HTML
const outputHtml = matches => {
    if(matches.length > 0){
        const html = matches.map(match => `
        <div class="box no-border mbottom-20">
            <div class="box-body">
                <div class="column-12 mbottom-16">
                    <div class="row no-margin">
                        <div class="column-9">
                            <h4 class="box-title display-inline">${match.attributes.title} </h4><span class="ex-title box-text mleft-20">${match.attributes.location.city}</span>
                        </div>
                        <div class="column-3 text-right">
                            <span class="box-date">${match.attributes.publications[0].publicationTime}</span>
                        </div>
                    </div>
                </div>
                <img class="company-logo" src="${match.attributes.company.logo}"></img>
                <p class="box-text comp-name">${match.attributes.company.name}</p>
                <p class="box-text box-info">${match.attributes.requirements}</p>
            </div>
        </div>

        `).join('');
      
        matchList.innerHTML = html;
    }
};

const searchBtn2 = document.querySelector('.search-button');
searchBtn2.addEventListener('click', (e) => {
    e.preventDefault();
    searchJobs(search.value);
  });

  search.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchJobs(search.value);
    }
});


