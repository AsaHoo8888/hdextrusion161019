import json,unittest
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
ROOT=Path(__file__).resolve().parents[1]
class Links(HTMLParser):
 def __init__(self):super().__init__();self.links=[];self.ids=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if 'id' in d:self.ids.append(d['id'])
  for key in ('href','src'):
   if key in d:self.links.append(d[key])
class CatalogTest(unittest.TestCase):
 def test_catalog_integrity(self):
  data=json.loads((ROOT/'assets/catalog/catalog.json').read_text())
  self.assertEqual(len(data['categories']),9);self.assertEqual(len(data['products']),38)
  self.assertEqual(len({p['slug'] for p in data['products']}),38)
  for p in data['products']:
   self.assertTrue((ROOT/p['image']).stat().st_size>1000)
   self.assertTrue((ROOT/'product'/f"{p['slug']}.html").exists())
   self.assertIn(p['category'],[c['slug'] for c in data['categories']])
 def test_local_links_and_anchors(self):
  for file in [*ROOT.glob('*.html'),*ROOT.glob('product/*.html'),*ROOT.glob('products-category/*.html')]:
   parser=Links();parser.feed(file.read_text())
   self.assertEqual(len(parser.ids),len(set(parser.ids)),file.name)
   for value in parser.links:
    url=urlsplit(value)
    if url.scheme or url.netloc:continue
    target=file.parent/unquote(url.path) if url.path else file
    self.assertTrue(target.exists(),f'{file}: {value}')
    if url.fragment and target.suffix=='.html':
     other=Links();other.feed(target.read_text());self.assertIn(url.fragment,other.ids,f'{file}: {value}')
if __name__=='__main__':unittest.main()
