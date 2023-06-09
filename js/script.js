'use strict';
const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML)
};
const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optArticleAuthor = '.post .post-author',
  optListAuthors = '.list.authors';
const titleClickHandler = function(event){
  event.preventDefault();
  const clickedElement = this;
  /* [done] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  /* [done] add class 'active' to the clicked link */
  console.log('Link was clicked!');
  clickedElement.classList.add('active');
  /* [done] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.posts .active');
  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log(articleSelector);
  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
};
function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  let html = '';
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  for(let article of articles){
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* get the title from the title element */
    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* insert link into titleList */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();
function calculateTagsParams(tags){
  const max = 0, min = 999999;
  const params = { max, min };
  for(let tag of tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    else if(tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}
function calculateTagClass(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix, classNumber;
}
function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles){
    /* find tags wrapper */
    const tagsList = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#' + tag +'">'+tag+'</a></li>';
      /* add generated code to html variable */
      html = html + linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]){
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    /* END LOOP: for each tag */
    }
    console.log('123', html, tagsList);
    /* insert HTML of all the links into the tags wrapper */
    tagsList.innerHTML = html;
  /* END LOOP: for every article: */
  }
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);
  /* [NEW] create variable for all links HTML code */
  let allTagsHTML = '';
  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
    const tagLinkCount = calculateTagClass(allTags[tag], tagsParams);
    allTagsHTML += '<li><a href="#' + tag +'">' + tag + '('+tagLinkCount+')</a></li> ';
  }
  /* [NEW] END LOOP: for each tag in allTags: */
  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
}
generateTags();
function tagClickHandler(event){
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('.data-tags a.active');
  /* START LOOP: for each active tag link */
  for(let activeTagLink of activeTagLinks){
    /* remove class active */
    activeTagLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const foundTagLinks = document.querySelectorAll('.data-tags a[href="${href}"]');
  /* START LOOP: for each found tag link */
  for(let foundTagLink of foundTagLinks) {
    /* add class active */
    foundTagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}
function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('.data-tags a');
  /* START LOOP: for each link */
  for(let tagLink of tagLinks){
    /* add tagClickHandler as event listener for that link */
    tagLink.addClickListener('click', tagClickHandler);
  /* END LOOP: for each link */
  }
}
addClickListenersToTags();

function generateAuthors(){
  let allAuthors = {};
  const allArticles = document.querySelectorAll(optArticleSelector);
  let sidebarAuthorsHTML = '';
  for (let article of allArticles){
    const authorWrapper = article.querySelector(optArticleAuthor);
    const author = article.getAttribute('data-author');
    const authorHTML = 'by <a href="#' + author + '">' + author + '</a>';
    authorWrapper.innerHTML = authorHTML;

    if(!allAuthors[author]){
      allAuthors[author] = 1;
    }
    else {
      allAuthors[author]++;
    }
  }
  for (let author in allAuthors){
    const authorForSidebarHTML = '<li><a href="#"><span class="author-name">' + author + '(' + allAuthors[author] + ')</span></a></li>';
    sidebarAuthorsHTML = sidebarAuthorsHTML + authorForSidebarHTML;
  }
  const authorsList = document.querySelector(optListAuthors);
  authorsList.innerHTML = sidebarAuthorsHTML;
}
generateAuthors();
function authorClickHandler(event){
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const author = href.replace('#','');
  generateTitleLinks('[data-author="' + author + '"]');
}
function addClickListenersToAuthors(){
  const links = document.querySelectorAll('.post .post-author a');
  for(let link of links){
    link.addEventListener('click', authorClickHandler);
  }
}
addClickListenersToAuthors();


