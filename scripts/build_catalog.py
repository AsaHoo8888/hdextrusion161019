"""Generate static catalogue pages from the reviewed source snapshot."""
import json,re,html
from pathlib import Path
from urllib.parse import quote
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'assets/catalog/catalog.json').read_text())
esc=lambda s:html.escape(str(s),quote=True)
base=(ROOT/'contact-us.html').read_text()
header=re.search(r'<header.*?</header>',base,re.S).group()
footer=re.search(r'<footer.*?</footer>',base,re.S).group()
header=header.replace('href="#inquiry" aria-current="page"','href="contact-us.html#inquiry"')
header=header.replace('<a href="products.html">Products</a>', '')
header=header.replace('<details class="nav-lines">','<a href="products.html" aria-current="page">Products</a>\n      <details class="nav-lines">')
footer=footer.replace(' aria-current="page"','').replace('href="#inquiry"','href="contact-us.html#inquiry"')
footer=footer.replace('<a href="products.html">Products</a>', '')
footer=footer.replace('<div class="footer-links">','<div class="footer-links"><a href="products.html">Products</a>')
arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'

def page(path,title,description,body):
 prefix='../' if '/' in path else ''
 markup=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#cb3a56"><title>{esc(title)} | HD Extrusion</title><meta name="description" content="{esc(description)}"><link rel="icon" href="assets/favicon.svg"><link rel="stylesheet" href="styles.css?v=20261028-logo"><link rel="stylesheet" href="catalog.css?v=20261110"><script src="navigation.js?v=20261028-nav" defer></script></head><body><a class="skip-link" href="#main">Skip to content</a>{header}<main id="main">{body}</main>{footer}</body></html>'''
 if prefix:
  markup=re.sub(r'(href|src)="(?!https?:|mailto:|tel:|#)([^"]+)"',lambda m:f'{m[1]}="{prefix}{m[2]}"',markup)
 target=ROOT/path;target.parent.mkdir(exist_ok=True);target.write_text(markup)

def sidebar(current):
 links='<a href="products.html"'+(' aria-current="page"' if not current else '')+'>All products</a>'
 for c in data['categories']:
  count=sum(p['category']==c['slug'] for p in data['products'])
  links+=f'<a href="products-category/{c["slug"]}.html"'+(' aria-current="page"' if current==c['slug'] else '')+f'>{esc(c["name"])}<span>{count}</span></a>'
 return f'<aside class="catalog-sidebar"><h2>Product categories</h2><nav aria-label="Product categories">{links}</nav></aside>'

def cards(products):
 return '<div class="catalog-grid">'+''.join(f'''<article class="catalog-item"><a href="product/{p['slug']}.html"><div class="catalog-image"><img src="{p['image']}" alt="{esc(p['name'])}" loading="lazy" width="600" height="400"></div><h3>{esc(p['name'])}</h3><span class="catalog-view">View equipment {arrow}</span></a></article>''' for p in products)+'</div>'

def listing(category=None):
 title=category['name'] if category else 'Equipment for your next production line.'
 products=[p for p in data['products'] if not category or p['category']==category['slug']]
 intro='Explore equipment, review specifications and discuss the configuration for your production.' if category else 'From complete extrusion lines to the equipment that keeps them running. Find the right starting point for your material and process.'
 body=f'<section class="catalog-opening wrap"><h1>{esc(title)}</h1><p>{intro}</p></section><div class="catalog-layout wrap">{sidebar(category["slug"] if category else None)}<section aria-label="Products"><div class="catalog-result"><p>{len(products)} products</p><a href="contact-us.html">Need help choosing? {arrow}</a></div>{cards(products)}</section></div>'
 page('products-category/'+category['slug']+'.html' if category else 'products.html',category['name'] if category else 'Products',intro,body)

def product_gallery(product):
    images = product['gallery']
    name = esc(product['name'])
    thumbnails = []
    for number, path in enumerate(images, 1):
        current = ' aria-current="true"' if number == 1 else ''
        thumbnails.append(
            f'<a href="{esc(path)}" aria-label="View {name}, photo {number}"{current}>'
            f'<img src="{esc(path)}" alt="" loading="lazy" width="80" height="64"></a>'
        )
    return f"""
    <figure class="equipment-gallery">
      <a class="gallery-full" href="{esc(images[0])}" aria-label="Open full-size equipment photo">
        <img src="{esc(images[0])}" alt="{name}, photo 1" width="800" height="600">
      </a>
      <figcaption><span aria-live="polite">Photo 1 of {len(images)}</span></figcaption>
      <div class="gallery-thumbnails">{''.join(thumbnails)}</div>
    </figure>"""

def product_sections(product):
    sections = []
    for section in product['sections']:
        blocks = []
        for block in section['blocks']:
            if 'image' in block:
                path = esc(block['image'])
                label = esc(block['alt'] or f"{product['name']} — {section['title']}")
                blocks.append(f'<a class="detail-photo" href="{path}"><img src="{path}" alt="{label}" loading="lazy"></a>')
            else:
                blocks.append(f'<p>{esc(block["text"])}</p>')
        sections.append(f'<section class="equipment-extra"><h2>{esc(section["title"])}</h2><div>{"".join(blocks)}</div></section>')
    return ''.join(sections)

def product_videos(product):
    players = []
    for number, video in enumerate(product['videos'], 1):
        label = f"{product['name']} — video {number}"
        players.append(f"""
        <div><iframe loading="lazy" src="https://www.youtube-nocookie.com/embed/{esc(video)}"
          title="{esc(label)}" referrerpolicy="strict-origin-when-cross-origin"
          allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>
        <a class="text-link" href="https://www.youtube.com/watch?v={esc(video)}">Watch on YouTube ↗</a></div>""")
    return f'<section class="equipment-extra"><h2>Equipment video</h2><div>{"".join(players)}</div></section>'

def product_inquiry(product):
    return f"""
    <section class="equipment-extra" id="product-inquiry">
      <div><h2>Ask about this machine</h2><p>{esc(product['name'])}</p></div>
      <div><form class="product-email-form" hidden data-product="{esc(product['name'])}">
        <label>Your name<input name="name" autocomplete="name" maxlength="100" required></label>
        <label>Work email<input name="email" type="email" autocomplete="email" maxlength="254" required></label>
        <label>Project requirements<textarea name="message" rows="4" maxlength="1500" required></textarea></label>
        <button class="button" type="submit">Prepare email draft</button>
        <p>Your email app opens a draft addressed to sales@hdextrusion.com for you to review and send.</p>
      </form><a class="text-link" href="mailto:sales@hdextrusion.com?subject={esc(quote('Inquiry: '+product['name']))}">Email sales directly</a></div>
    </section>"""


listing()
for category in data['categories']:listing(category)
for p in data['products']:
 category=next(c for c in data['categories'] if c['slug']==p['category'])
 intro=''.join(f'<p>{esc(t)}</p>' for t in p['paragraphs']) or '<p>Discuss the equipment configuration, material and required capacity with our team.</p>'
 tables=''
 for rows in p['tables']:
  rows=[row for row in rows if any(cell['text'] for cell in row)]
  if not rows:continue
  tables+='<div class="catalog-table" tabindex="0" role="region" aria-label="Scrollable technical specifications"><table><caption>Reference specifications</caption><tbody>'
  for row in rows:
   tables+='<tr>'
   for i,cell in enumerate(row):
    tag='th' if i==0 else 'td'
    attrs=' scope="row"' if i==0 else ''
    attrs+=''.join(f' {key}="{cell[key]}"' for key in ('colspan','rowspan') if key in cell)
    tables+=f'<{tag}{attrs}>{esc(cell["text"])}</{tag}>'
   tables+='</tr>' 
  tables+='</tbody></table></div>'
 related=[x for x in data['products'] if x['category']==p['category'] and x['slug']!=p['slug']][:2]
 body=f'''<div class="wrap"><nav class="catalog-breadcrumb" aria-label="Breadcrumb"><a href="products.html">Products</a><span>/</span><a href="products-category/{category['slug']}.html">{esc(category['name'])}</a></nav><section class="equipment-opening"><div><h1>{esc(p['name'])}</h1><p>{esc(p['summary'])}</p><a class="button" href="#product-inquiry">Inquire about this product {arrow}</a><a class="equipment-brief" href="contact-us.html#inquiry">Prepare a detailed project brief</a></div>{product_gallery(p)}</section><section class="equipment-description"><h2>Equipment overview</h2><div>{intro}</div></section>'''
 if tables:body+=f'<section class="equipment-specifications"><h2>Technical specifications</h2><p>Reference configurations from the product catalogue. Confirm output, dimensions and equipment selection for your material and project.</p>{tables}</section>'
 body+=product_sections(p)+product_videos(p)+product_inquiry(p)
 body+='<script src="product-detail.js" defer></script>'
 body+=f'<p class="catalog-source"><a href="{p["source"]}" target="_blank" rel="noopener noreferrer">Original product reference</a></p>'
 if related:body+=f'<section class="equipment-related"><h2>Explore related equipment</h2>{cards(related)}</section>'
 body+='</div>'
 page('product/'+p['slug']+'.html',p['name'],'Explore '+p['name']+' from Huade Machinery. Review equipment details and request a configuration for your project.',body)
print(f'Built catalogue, {len(data["categories"])} categories and {len(data["products"])} product pages.')
