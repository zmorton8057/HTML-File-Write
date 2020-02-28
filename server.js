var fs = require('fs');

fs.readFile('content.csv', 'utf8', function(err, contents) {
  if (err) throw err;

  function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
  }

  var result = contents.split('\r\n');
  var finalTable = [];

  for (var i = 1; i < result.length - 1; i++) {
    var SKU = result[i].split(',')[0];
    var href = result[i].split(',')[0].replace(/\//g, '-');
    var desc = result[i].split(',')[1].replace(/-_-/g, ',');
    var small = result[i]
      .split(',')[2]
      .replace(/-_-/g, ',')
      .replace(/``/g, '"');
    var listPrice = precisionRound(result[i].split(',')[3], 2)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&,');
    var ourPrice = precisionRound(result[i].split(',')[4], 2)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$&,');
    var isFreeShipping = result[i].split(',')[5];

    var smallDesc = '';

    var desc2 = desc;
    var brand = 'Dell';
    var site = 'NetSolutionWorks';
    var vendorLogo =
      '<img src="/images/dell-premier-partner.png" alt="Dell PartnerDirect Premier Partner" class="vendorLogo">';

    var freeShipping = '';

    if (isFreeShipping === '1') {
      freeShipping =
        '<img src="/images/free-shipping/Free-Shipping-TruckGrey-vrt-xsm.png" width="45" alt="USA: FREE Ground Shipping" class="img-responsive fltrt">';
    }

    if (small !== '0') {
      smallDesc = `<br>
            <small>${small}</small>`;
    }

    var price = '';

    if (ourPrice === '0.00') {
      ourPrice = listPrice;
      price = `<span class="price">Our Price: $${ourPrice}</span>`;
    } else {
      price = `List Price: <del>$${listPrice}</del><br>
            <span class="price">Our Price: $${ourPrice}</span>`;
    }

    if (desc.split(' ')[0] !== brand.split(' ')[0]) {
      desc2 = `${brand} ${desc}`;
    }

    fs.writeFile(
      `./dump/${href}.asp`,
      `<!DOCTYPE html>
<html lang="en-us">
<head>
<meta charset="utf-8">
<title>${desc2} | ${site}.com</title>
<meta name="Description" content="${desc2}">
<link rel="canonical" href="http://www.${site.toLowerCase()}.com/${href}.asp">
<!--#include virtual ="/includes/Head.inc"-->
</head>
<body>
<div class="container"> 
  <!--#include virtual ="/includes/TopMenu.inc"-->
  <ul class="breadcrumb">
    <li><a href="/">Home</a></li>
    <li><a href="/products.asp">Products</a></li>
    <li class="active">${SKU}</li>
  </ul>
  <div class="content">${vendorLogo}
    <h1>${brand} ${SKU}<br>
      <span class="smallHeaderText">${desc}</span></h1>
    <br>
    <br>
    <h2 class="text-center">[IMAGE AND CONTENT COMING SOON]</h2>
    <br>
    <br>
    <div class="pricing panel panel-primary">
      <div class="panel-heading">${brand} Products</div>
      <div class="panel-body">
        <div class="row">
          <div class="col-sm-7">${freeShipping}<strong>${desc}</strong>${smallDesc}</div>
          <div class="col-sm-3">#${SKU}<br>
            ${price}</div>
          <div class="col-sm-2">
            <form action="/Portal/Cart/AddToCart" method="get">
              <input type="hidden" name="item" value="${SKU} - ${desc2}">
              <input type="hidden" name="price" value="$${ourPrice}">
              <input type="hidden" name="quantity" value="1">
              <button type="submit" class="btn btn-primary center-block"><i class="fa fa-shopping-cart"></i> Add to Cart</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <!--<p class="text-center"><a href="#pricing"><strong>Click here to jump to more pricing!</strong></a></p>
    <div role="tab-panel">
      <ul class="nav nav-tabs" role="tablist">
        <li role="presentation" class="active"><a href="#overview" aria-controls="overview" role="tab" data-toggle="tab">Overview</a></li>
        <li role="presentation"><a href="#features" aria-controls="features" role="tab" data-toggle="tab">Features</a></li>
        <li role="presentation"><a href="#specs" aria-controls="specs" role="tab" data-toggle="tab">Specifications</a></li>
        <li role="presentation"><a href="#documentation" aria-controls="documentation" role="tab" data-toggle="tab">Documentation</a></li>
      </ul>
    </div>
    <div class="tab-content">
      <div id="overview" class="tab-pane active" role="tabpanel">
        <h2>Overview:</h2>
      </div>
      <div id="features" class="tab-pane" role="tabpanel">
        <h2>Features:</h2>
      </div>
      <div id="specs" class="tab-pane" role="tabpanel">
        <h2>Specifications:</h2>
      </div>
      <div id="documentation" class="tab-pane" role="tabpanel">
        <h2>Documentation:</h2>
        <p><i class="fa fa-file-pdf-o fa-2x" style="margin:0 10px"></i><strong>Download the <a target="_blank" href="datasheets/location">${desc2} Datasheet</a> (PDF).</strong></p>
      </div>
    </div>
    <p id="pricing"><strong>Pricing Notes:</strong></p>
    <ul>
      <li>Pricing and product availability subject to change without notice.</li>
    </ul>
    <div class="pricing panel panel-primary">
      <div class="panel-heading">${brand} Products</div>
      <div class="panel-body">
        <div class="row">
          <div class="col-sm-7">${freeShipping}<strong>${desc}</strong>${smallDesc}</div>
          <div class="col-sm-3">#${SKU}<br>
            ${price}</div>
          <div class="col-sm-2">
            <form action="/Portal/Cart/AddToCart" method="get">
              <input type="hidden" name="item" value="${SKU} - ${desc2}">
              <input type="hidden" name="price" value="$${ourPrice}">
              <input type="hidden" name="quantity" value="1">
              <button type="submit" class="btn btn-primary center-block"><i class="fa fa-shopping-cart"></i> Add to Cart</button>
            </form>
          </div>
        </div>
      </div>
    </div>-->
  </div>
</div>
<!--#include virtual ="/includes/Footer.inc"-->
</body>
</html>`,
      function(err) {
        if (err) throw err;
        console.log(`${SKU}.asp created!`);
      }
    );
  }
});
