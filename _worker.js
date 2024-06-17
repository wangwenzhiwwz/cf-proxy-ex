addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  thisProxyServerUrlHttps = `${url.protocol}//${url.hostname}/`;
  thisProxyServerUrl_hostOnly = url.host;
  //console.log(thisProxyServerUrlHttps);
  //console.log(thisProxyServerUrl_hostOnly);

  event.respondWith(handleRequest(event.request))
})

const str = "/";
const proxyCookie = "__PROXY_VISITEDSITE__";
var thisProxyServerUrlHttps;
var thisProxyServerUrl_hostOnly;
// const CSSReplace = ["https://", "http://"];
const httpRequestInjection = `

//information
var now = new URL(window.location.href);
var path = now.pathname.substring(1);
if(!path.startsWith("http")) path = "https://" + path;
var base = now.host;
var protocol = now.protocol;
var nowlink = protocol + "//" + base + "/";




inject();





//add change listener - new link
window.addEventListener('load', () => {
  loopAndConvertToAbs();
  obsPage();
});
console.log("WINDOW ONLOAD EVENT ADDED");



function loopAndConvertToAbs(){
  for(var ele of document.querySelectorAll('*')){
    covToAbs(ele);
  }
  console.log("LOOPED EVERY ELEMENT");
}
function inject(){
  //inject network request
  var originalOpen = XMLHttpRequest.prototype.open;
  var originalFetch = window.fetch;
  XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
    if(url.indexOf(base) == -1) url = nowlink + new URL(url, path).href;
    console.log("R:" + url);
    return originalOpen.apply(this, arguments);
  };

  window.fetch = function(input, init) {
    if(input.indexOf(base) == -1) input = nowlink + new URL(input, path).href;
    console.log("R:" + input);
    return originalFetch(input, init);
  };
  console.log("NETWROK REQUEST METHOD INJECTED");


}


function obsPage(){
  var yProxyObserverTimeoutId;
  var yProxyObserverEles = []; // 初始化 yProxyObserverEles 数组
  var yProxyObserver = new MutationObserver(elements => {
    yProxyObserverEles = yProxyObserverEles.concat(elements);
    clearTimeout(yProxyObserverTimeoutId);
    yProxyObserverTimeoutId = setTimeout(() => {
      for(var ele of yProxyObserverEles){
          covToAbs(ele);
      }
      yProxyObserverEles = [];
    }, 500);
  });
  var config = { attributes: true, childList: true, subtree: true };
  yProxyObserver.observe(document.body, config);

  console.log("OBSERVING THE WEBPAGE...");
}
function covToAbs(element){
  var relativePath = "";
  var setAttr = "";
  if (element instanceof HTMLElement && element.hasAttribute("href")) {
    relativePath = element.getAttribute("href");
    setAttr = "href";
  }
  if (element instanceof HTMLElement && element.hasAttribute("src")) {
    relativePath = element.getAttribute("src");
    setAttr = "src";
  }
  
    //new URL("a", "htpps://www.google.com/b").href;
  if(setAttr != "" && !relativePath.includes(base)){ //!relativePath.includes(nowlink)防止已经改变，因为有observer
    if(!relativePath.startsWith("data:") && !relativePath.startsWith("javascript:")){
      try{
        var absolutePath = nowlink + new URL(relativePath, path).href;
        element.setAttribute(setAttr, absolutePath);
      }catch{
        console.log(path + "   " + relativePath);
      }
    }
  }
}


`;
const mainPage = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>你的代理项目</title>
  <style>
    body {
      background: #fff;
      color: #000;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    a {
      color: #000;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    del {
      color: #666;
    }
    .important {
      font-weight: bold;
      font-size: 18px;
    }
    h3, h1 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    ul {
      font-size: 16px;
      margin-bottom: 20px;
      text-align: left;
      list-style-position: inside;
      padding-left: 0;
    }
    li {
      margin-bottom: 10px;
    }
    p {
      font-size: 280px !important;
      width: 100%;
      text-align: center;
      margin-top: 50px;
      margin-bottom: 50px;
    }
    @media (min-width: 800px) {
      body {
        max-width: 800px;
        margin: 0 auto;
      }
    }
  </style>
</head>
<body>
  <h3>
    我创建了这个项目，因为我学校里的某些极其恼人的网络过滤软件，它臭名昭著，就是 "Goguardian"，现在它已经开源在 <a href="https://github.com/1234567Yang/cf-proxy-ex/">https://github.com/1234567Yang/cf-proxy-ex/</a>。
  </h3>
  <br><br><br>
  <ul>
    <li class="important">如何使用这个代理：<br>
      在网址后输入你想访问的网站，例如：<br>
      https://当前网址/github.com<br>或者<br>https://当前网址/https://github.com</li>
    <br>
    <li>如果你的浏览器显示400错误，请清除浏览器的Cookie。<br></li>
    <li>我为什么创建这个项目：<br> 因为学校封锁了我能找到的所有数学/计算机科学和其他学科的学习材料和问题解答网站。在学校的眼中，中国（以及其他一些国家）似乎不在这个 "世界" 的范围内。他们封锁中国的服务器IP地址，并封锁中国的搜索引擎和视频网站。当然，一些常用的社交软件也被封锁了，这曾经使我在校园内无法向父母发送消息。我认为这不应该是这样，所以我要尽我所能去反对。我相信这不仅会使我受益，还会使更多的人受益。</li>
    <li>如果你的学校封锁了这个网站：<br>请通过邮箱联系我：<a href="mailto:help@wvusd.homes">help@wvusd.homes</a>，我会设置一个新的网页。</li>
    <li>限制：<br>尽管我尽力使每个网站都可以代理访问，但仍可能有页面或资源无法加载，最重要的是 <span class="important">你绝对不应该通过在线代理登录任何账户</span>。</li>
  </ul>

  <h1>
    
  </h1>
  <br><br><br>
  <h3>
    <br>
    <span>可以绕过学校网络封锁的代理：</span>
    <br><br>
    <span>传统的VPN，如 <a href="https://hide.me/">hide me</a>。</span>
    <br><br>
    <a href="https://www.torproject.org/">Tor浏览器</a><span>，即洋葱路由器，是一款用于实现匿名通信的免费开源软件。它通过一个由全球志愿者组成的免费覆盖网络来引导互联网流量，该网络包含超过七千个中继节点。使用Tor可以更难追踪用户的互联网活动。</span>
    <br><br>
    <a href="https://v2rayn.org/">v2RayN</a><span> 是一个Windows的GUI客户端，支持Xray核心、v2fly核心等。您必须订阅一个 <a href="https://aijichang.org/6190/">机场</a> 才能使用。例如，您可以订阅 <a href="https://feiniaoyun.xyz/">飞鸟云</a>。</span>
    <br><br>
    <span>通过代理绕过 <del>Goguardian</del>：您可以购买一个域名（$1），并自行设置：<a href="https://github.com/gaboolic/cloudflare-reverse-proxy">如何设置代理</a>。除非 <del>Goguardian</del> 使用白名单模式，否则这种方法始终有效。</span>
    <br>
    <span>太贵？没关系！有许多免费的域名注册公司（域名的第一年）不需要任何信用卡，去网上搜索一下吧！</span>
    <br><br>
    <span>解锁YouTube视频："感谢"俄罗斯开始侵入乌克兰，谷歌屏蔽了来自俄罗斯的流量，有很多镜像站点正在运行。你甚至可以 <a href="https://github.com/iv-org/invidious">自己设置一个</a>。</span>
  </h3>
  <a href="https://goguardian.com" style="visibility:hidden"></a>
  <a href="https://blocked.goguardian.com/" style="visibility:hidden"></a>
  <a href="https://www.google.com/gen_204" style="visibility:hidden"></a>
  <p>
    ☭
  </p>
</body>
</html>

`;
const redirectError = `
<html><head></head><body><h2>Error while redirecting: the website you want to access to may contain wrong redirect information, and we can not parse the info</h2></body></html>
`;

//new URL(请求路径, base路径).href;

async function handleRequest(request) {
  const url = new URL(request.url);
  //var siteOnly = url.pathname.substring(url.pathname.indexOf(str) + str.length);

  var actualUrlStr = url.pathname.substring(url.pathname.indexOf(str) + str.length) + url.search + url.hash;
  if (actualUrlStr == "") { //先返回引导界面
    return getHTMLResponse(mainPage);
  }


  try{
    var test = actualUrlStr;
    if(!test.startsWith("http")){
      test = "https://" + test;
    }
    var u = new URL(test);
    if(!u.host.includes(".")){
      throw new Error();
    }
  }
  catch{ //可能是搜素引擎，比如proxy.com/https://www.duckduckgo.com/ 转到 proxy.com/?q=key
    var siteCookie = request.headers.get('Cookie');
    var lastVisit;
    if(siteCookie != null && siteCookie != ""){
      lastVisit = getCook(proxyCookie, siteCookie);
      console.log(lastVisit);
      if(lastVisit != null && lastVisit != ""){
        //(!lastVisit.startsWith("http"))?"https://":"" + 
        //现在的actualUrlStr如果本来不带https:// 的话那么现在也不带，因为判断是否带protocol在后面
        return Response.redirect(thisProxyServerUrlHttps + lastVisit + "/" + actualUrlStr, 301); 
      }
  }
  return getHTMLResponse("Something is wrong while trying to get your cookie: <br> siteCookie: " + siteCookie + "<br>" + "lastSite: " + lastVisit);
  }



  if (!actualUrlStr.startsWith("http") && !actualUrlStr.includes("://")) { //从www.xxx.com转到https://www.xxx.com
    //actualUrlStr = "https://" + actualUrlStr;
    return Response.redirect(thisProxyServerUrlHttps + "https://" + actualUrlStr, 301);
  }
  //if(!actualUrlStr.endsWith("/")) actualUrlStr += "/";
  const actualUrl = new URL(actualUrlStr);

  let clientHeaderWithChange = new Headers();
  //***代理发送数据的Header：修改部分header防止403 forbidden，要先修改，   因为添加Request之后header是只读的（***ChatGPT，未测试）
  for (var pair of request.headers.entries()) {
    //console.log(pair[0]+ ': '+ pair[1]);
    clientHeaderWithChange.set(pair[0], pair[1].replaceAll(thisProxyServerUrlHttps, actualUrlStr).replaceAll(thisProxyServerUrl_hostOnly, actualUrl.host));
  }
  


  const modifiedRequest = new Request(actualUrl, {
    headers: clientHeaderWithChange,
    method: request.method,
    body: request.body,
    //redirect: 'follow'
    redirect: "manual"
    //因为有时候会
    //https://www.jyshare.com/front-end/61   重定向到
    //https://www.jyshare.com/front-end/61/
    //但是相对目录就变了
  });

  //console.log(actualUrl);

  const response = await fetch(modifiedRequest);
  if (response.status.toString().startsWith("3") && response.headers.get("Location") != null) {
    //console.log(base_url + response.headers.get("Location"))
    try {
      return Response.redirect(thisProxyServerUrlHttps + new URL(response.headers.get("Location"), actualUrlStr).href, 301);
    } catch {
      getHTMLResponse(redirectError + "<br>the redirect url:" + response.headers.get("Location") + ";the url you are now at:" + actualUrlStr);
    }
  }

  var modifiedResponse;
  var bd;
  
  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.startsWith("text/")){
    bd = await response.text();

//bd.includes("<html")  //不加>因为html标签上可能加属性         这个方法不好用因为一些JS中竟然也会出现这个字符串
    if (contentType && contentType.includes("text/html")) {
      //console.log("STR" + actualUrlStr)
      bd = covToAbs(bd, actualUrlStr);
      bd = "<script>" + httpRequestInjection + "</script>" + bd;
    }
    //else{
    //   //const type = response.headers.get('Content-Type');type == null || (type.indexOf("image/") == -1 && type.indexOf("application/") == -1)
    //   if(actualUrlStr.includes(".css")){ //js不用，因为我已经把网络消息给注入了
    //     for(var r of CSSReplace){
    //       bd = bd.replace(r, thisProxyServerUrlHttps + r);
    //     }
    //   }
    //   //问题:在设置css background image 的时候可以使用相对目录  
    // }
    //console.log(bd);

    modifiedResponse = new Response(bd, response);  
  }else{
    var blob = await response.blob();
    modifiedResponse = new Response(blob, response);
  }




  let headers = modifiedResponse.headers;
  let cookieHeaders = [];
  
  // Collect all 'Set-Cookie' headers regardless of case
  for (let [key, value] of headers.entries()) {
      if (key.toLowerCase() == 'set-cookie') {
          cookieHeaders.push({ headerName: key, headerValue: value });
      }
  }


  if (cookieHeaders.length > 0) {
      cookieHeaders.forEach(cookieHeader => {
          let cookies = cookieHeader.headerValue.split(',').map(cookie => cookie.trim());
          
          for (let i = 0; i < cookies.length; i++) {
              let parts = cookies[i].split(';').map(part => part.trim());
              //console.log(parts);
              
              // Modify Path
              let pathIndex = parts.findIndex(part => part.toLowerCase().startsWith('path='));
              let originalPath;
              if (pathIndex !== -1) {
                originalPath = parts[pathIndex].substring("path=".length);
              }
              let absolutePath = "/" + new URL(originalPath, actualUrlStr).href;;
              
              if (pathIndex !== -1) {
                  parts[pathIndex] = `Path=${absolutePath}`;
              } else {
                  parts.push(`Path=${absolutePath}`);
              }
              
              // Modify Domain
              let domainIndex = parts.findIndex(part => part.toLowerCase().startsWith('domain='));
              
              if (domainIndex !== -1) {
                  parts[domainIndex] = `domain=${thisProxyServerUrl_hostOnly}`;
              } else {
                  parts.push(`domain=${thisProxyServerUrl_hostOnly}`);
              }
              
              cookies[i] = parts.join('; ');
          }
          
          // Re-join cookies and set the header
          headers.set(cookieHeader.headerName, cookies.join(', '));
      });
  }
  //bd != null && bd.includes("<html")
  if (contentType && contentType.includes("text/html")) { //如果是HTML再加cookie，因为有些网址会通过不同的链接添加CSS等文件
    let cookieValue = proxyCookie + "=" + actualUrl.origin + "; Path=/; Domain=" + thisProxyServerUrl_hostOnly;
    //origin末尾不带/
    //例如：console.log(new URL("https://www.baidu.com/w/s?q=2#e"));
    //origin: "https://www.baidu.com"
    headers.append("Set-Cookie", cookieValue);
  }

  // 添加允许跨域访问的响应头
  modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
  modifiedResponse.headers.set("Content-Security-Policy", "");
  modifiedResponse.headers.set("X-Frame-Options", "");

  return modifiedResponse;
}

//https://stackoverflow.com/questions/5142337/read-a-javascript-cookie-by-name
function getCook(cookiename, cookies) {
  // Get name followed by anything except a semicolon
  var cookiestring=RegExp(cookiename + "=[^;]+").exec(cookies);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./,"") : "");
}


const matchList = [[/href=("|')([^"']*)("|')/g, `href="`], [/src=("|')([^"']*)("|')/g, `src="`]];
function covToAbs(body, requestPathNow) {
  for (var match of matchList) {
    var setAttr = body.matchAll(match[0]);
    if (setAttr != null) {
      for (var replace of setAttr) {
        if (replace.length == 0) continue;
        var strReplace = replace[0];
        if (!strReplace.includes(thisProxyServerUrl_hostOnly)) {
          if(!strReplace.includes("*")){ //可能是正则匹配，如chat.bing.com中的<script>中有一段代码：u.replace(/href="[^"]*"/,'href…………
            //TODO: 用更多方式判断是否是正则，欢迎PR
            var relativePath = strReplace.substring(match[1].toString().length, strReplace.length - 1); //-1因为右边的引号
            if (!relativePath.startsWith("data:") && !relativePath.startsWith("javascript:")) {
              try {
                var absolutePath = thisProxyServerUrlHttps + new URL(relativePath, requestPathNow).href;
                body = body.replace(strReplace, match[1].toString() + absolutePath + `"`);
              } catch {
                //可能是网站的href或者src设置错误
                //无视
              }
            }
          }
        }
      }
    }
  }

  return body;
}
function getHTMLResponse(html) {
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8"
    }
  });
}
