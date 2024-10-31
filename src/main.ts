import { setupCounter } from './counter.ts'
import { setupCustomerForm } from './customer.ts'
import { FT } from '../lib/js/sdk-js.ts'
import typescriptLogo from './typescript.svg'
import './style.css'
import viteLogo from '/vite.svg'

declare global {
  interface Window {
    FT: ReturnType<typeof FT>
  }
}

const apiKey = import.meta.env.VITE_FEATRACK_API_KEY as string
const appSlug = import.meta.env.VITE_APPLICATION_SLUG as string

if (!window.FT) {
  window.FT = FT(apiKey, appSlug, {
    ftApiUrl: import.meta.env.VITE_FEATRACK_API_URL as string,
  })
}

window.FT.customers.identify('123456')

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>

      <form id="customer-create">
        <label for="uniqueId">Unique ID</label>
        <input type="text" id="uniqueId" name="uniqueId" required />
        <label for="name">Name</label>
        <input type="text" id="name" name="name" />
        <button type="submit">Create Customer</button>
      </form>
    </div>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
setupCustomerForm(document.querySelector<HTMLFormElement>('#customer-create')!)
