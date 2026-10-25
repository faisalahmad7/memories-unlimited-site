import pdfplumber, json, re
pdf=pdfplumber.open('rates.pdf')
# column x-boundaries in PDF points, measured from the rendered pages; (key, x_from, x_to)
SPEC={
 'oneday':[('name',0,254),('location',254,332),('preprimary',332,389),('i_iv',389,440),('v_x',440,489),('xi_xii',489,538),('college',538,700)],
 'field':[('name',40,372),('i_iv',372,446),('v_x',446,518),('college',518,700)],
 'edutainment':[('name',40,372),('i_iv',372,446),('v_x',446,518),('college',518,700)],
 'camping':[('name',40,397),('days',397,446),('i_x',446,518),('college',518,700)],
 'tours6':[('name',40,391),('days',391,440),('v_x',440,511),('college',511,700)],
 'tours7':[('name',40,400),('days',400,450),('i_x',450,522),('college',522,700)],
}
PAGES={1:('oneday','one-day-picnic'),2:('oneday','one-day-picnic'),3:('field','field-trip'),4:('edutainment','edutainment'),5:('camping','camping'),6:('tours6','multi-day-tour'),7:('tours7','multi-day-tour')}
rows=[]
for pn,(spec,cat) in PAGES.items():
    p=pdf.pages[pn-1]; ws=p.extract_words()
    nos=[w for w in ws if re.fullmatch(r'\d{1,2}',w['text']) and w['x0']<40 and w['top']>150]
    nos.sort(key=lambda w:w['top'])
    start=int(nos[0]['text']); seq=[]  # keep only the 1,2,3... row-number column; drops stray numbers in the notes (e.g. "20 students")
    for w in nos:
        if int(w['text'])==start+len(seq): seq.append(w)
    nos=seq
    cells={}
    for w in ws:
        if w['top']<150 or w in nos: continue
        if w['top']>nos[-1]['top']+22: continue   # below the table (notes/footer)
        cy=(w['top']+w['bottom'])/2
        k=min(range(len(nos)),key=lambda i:abs((nos[i]['top']+nos[i]['bottom'])/2-cy))
        cx=(w['x0']+w['x1'])/2
        for key,a,b in SPEC[spec]:
            if a<=cx<b: cells.setdefault((k,key),[]).append(w); break
    for k,n in enumerate(nos):
        r={'no':int(n['text']),'category':cat,'page':pn}
        for key,_,_ in SPEC[spec]:
            ww=sorted(cells.get((k,key),[]),key=lambda w:(round(w['top']/6),w['x0']))
            r[key]=' '.join(w['text'] for w in ww)
        rows.append(r)
json.dump(rows,open('rates_raw.json','w'),ensure_ascii=False,indent=1)
from collections import Counter
print(Counter((r['category'],r['page']) for r in rows))
for r in rows: print({k:v for k,v in r.items() if k not in('category',)})
