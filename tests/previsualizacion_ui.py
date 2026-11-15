"""Previsualización visual con stub de API. Requiere Python Playwright + Chromium.

NO es una prueba E2E de HTTP desde el navegador: en el entorno de producción de
este artefacto se bloqueó la navegación directa a localhost dentro de Chromium.
El fixture se obtiene por urllib desde el servidor de prueba y se intercepta
`fetch` en la pestaña cargada con set_content.
"""
import asyncio
import json
import pathlib
import urllib.request
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
BASE = 'http://127.0.0.1:4173'

async def main():
    with urllib.request.urlopen(BASE+'/api/bootstrap') as response:
        data=json.load(response)
    html=(ROOT/'public/index.html').read_text(encoding='utf8').replace('<script src="/app.js" defer></script>','')
    css=(ROOT/'public/styles.css').read_text(encoding='utf8')
    js=(ROOT/'public/app.js').read_text(encoding='utf8')
    out=ROOT/'evidencias';out.mkdir(exist_ok=True)
    async with async_playwright() as p:
        browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        for is_mobile,width,height in [(True,390,844),(False,1365,830)]:
            context=await browser.new_context(viewport={'width':width,'height':height},is_mobile=is_mobile,has_touch=is_mobile)
            page=await context.new_page()
            await page.set_content(html)
            await page.add_style_tag(content=css)
            await page.add_script_tag(content=f'''window.__fixture={json.dumps(data,ensure_ascii=False)};
Object.defineProperty(window,'localStorage',{{value:{{setItem(){{}},getItem(){{return null}}}}}});
window.fetch=async (url) => ({{ok:true,status:200,async json(){{return String(url)==='/api/bikes'?{{items:window.__fixture.bikes}}:window.__fixture;}}}});''')
            await page.add_script_tag(content=js)
            await page.locator('.service-card').first.wait_for()
            assert await page.locator('.service-card').count()==7
            assert await page.evaluate('document.documentElement.scrollWidth<=window.innerWidth')
            for section in ['inicio','bicicletas','tributos','reclamos','contactos','alarmas','estacionamiento','avisos']:
                await page.evaluate('(s)=>location.hash="#/"+s',section)
                await page.locator('main h1').first.wait_for()
                await page.screenshot(path=str(out/f'{"movil" if is_mobile else "escritorio"}_{section}.png'),full_page=True)
            await context.close()
        await browser.close()
if __name__=='__main__':
    asyncio.run(main())
