console.log("js loaded")
const contentDom = document.getElementById("content")
const formDom = document.querySelector("form")
formDom.addEventListener("submit", onSubmit)

const submitBtnDom = document.getElementById("submitBtn")
console.log(submitBtnDom)
const onTypeDoms = document.querySelectorAll(".onType")
onTypeDoms.forEach((item) => {item.addEventListener("input", () => submitBtnDom.click())})
// onTypeDoms.addEventListener("input", () => submitBtnDom.click())
// page 2
// document.getElementById("page2").addEventListener("click", )

function onSubmit () {
  console.log(event)
  event.preventDefault()
  let queryObject = ""
  if (event.target[0].value) {
    queryObject = queryObject + `name=${event.target[0].value}&`
  }
  if (!(event.target[2].value === "all")) {
    queryObject = queryObject + `company=${event.target[2].value}&`
  }
  // (function () {
  //   // if ((event.target[3].value) && (event.target[4].value)) {
  //   //   queryObject = queryObject + `numericFilters=price>${event.target[3].value},price<${event.target[4].value}&`
  //   //   return
  //   // }
  //   if (event.target[3].value) {
  //     console.log('one given')
  //     queryObject = queryObject + `numericFilters=price>${event.target[3].value}&`
  //   }
  //   if (event.target[4].value) {
  //     console.log('one given')
  //     queryObject = queryObject + `numericFilters=price<${event.target[4].value}&`
  //   }
  // })()
  if (event.target[3].value) {
    console.log('one given')
    queryObject = queryObject + `numericFilters=price>${event.target[3].value}&`
  }
  if (event.target[4].value) {
    console.log('one given')
    queryObject = queryObject + `numericFilters=price<${event.target[4].value}&`
  }
  if (!(event.target[5].value === "all")) {
    queryObject = queryObject + `featured=${event.target[5].value}&`
  }
  
  console.log(event.target[7].value)
  if (event.target[6].value) {
    queryObject = queryObject + `numericFilters=rating>${event.target[6].value}&`
  }
  if (!(event.target[7].value === "all")) {
    queryObject = queryObject + `sort=${event.target[7].value}&`
  }
  let page = 1
  if (event.submitter.id === 'page2') {
    queryObject = queryObject + `page=2`;
    page = 2
  }
  if (event.submitter.id === 'page3') {
    queryObject = queryObject + `page=3`;
    page = 3
  }
  console.log("page")
  console.log(queryObject)
  postData(queryObject, page)
}

async function postData (queryparams, page) {
    console.log(queryparams)
    res = await fetch("/api/v1/products"+`?${queryparams}`, {
      method: "GET"
    })
    json = await res.json()
    console.log(json)
    console.log(page)
    let sn = (page - 1) * 10
    if (!page) {
      sn = 0
    }
    renderedArray = json.products.map((item) => {
        sn ++
        return (`
        <div class="row gx-2">
            <div class="col-1"><div>${sn}</div></div>
            <div class="col-3 name"><div>${item.name}</div></div>
            <div class="col-2 company"><div>${item.company}</div></div>
            <div class="col-2"><div>${item.featured}</div></div>
            <div class="col-2"><div>${item.rating}</div></div>
            <div class="col-2"><div>$ ${item.price}</div></div>
        </div>
        `)
    }).join('')
    contentDom.innerHTML = renderedArray
    const pageDomArr = document.querySelectorAll(".pageno")
    pageDomArr.forEach((item) => {
      item.classList.remove("activePage")
    })
    document.getElementById(`page${json.page}`).classList.add("activePage")
}

postData()