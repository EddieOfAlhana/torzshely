import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  const { i18n } = useTranslation()
  const isHu = i18n.language === 'hu'

  return (
    <div className="min-h-screen bg-pub-dark text-pub-cream">
      {/* Header */}
      <div className="bg-pub-black border-b border-pub-gold/20 py-6 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="font-display text-pub-gold text-xl tracking-widest hover:text-pub-gold-light transition-colors">
            ← TÖRZSHELY 16
          </Link>
          <div className="text-pub-cream/40 text-xs font-display tracking-widest uppercase">
            {isHu ? 'Adatkezelési Tájékoztató' : 'Privacy Policy'}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {isHu ? <HungarianContent /> : <EnglishContent />}
      </div>

      <footer className="border-t border-pub-gold/10 py-8 text-center text-pub-cream/30 text-xs">
        © {new Date().getFullYear()} Törzshely 16 – Thököly út 7/b, 1163 Budapest
      </footer>
    </div>
  )
}

function HungarianContent() {
  return (
    <div className="prose-pub">
      <h1>Adatkezelési Tájékoztató</h1>
      <p className="text-pub-cream/50 text-sm">Hatályos: 2025. január 1-től</p>

      <Section title="1. Az adatkezelő adatai">
        <p>
          <strong>Cégnév:</strong> Törzshely 16<br />
          <strong>Székhely:</strong> 1163 Budapest, Thököly út 7/b<br />
          <strong>E-mail:</strong> torzshely16@gmail.com<br />
          <strong>Telefon:</strong> +36 30 383 9818
        </p>
      </Section>

      <Section title="2. Az adatkezelés célja és jogalapja">
        <p>Az alábbi célokból kezelünk személyes adatokat:</p>
        <table>
          <thead>
            <tr><th>Adatkezelési cél</th><th>Kezelt adatok</th><th>Jogalap</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Asztalfoglalás kezelése</td>
              <td>Név, telefonszám, e-mail cím, vendégek száma, megjegyzés</td>
              <td>Szerződés teljesítése (GDPR 6. cikk (1) b)</td>
            </tr>
            <tr>
              <td>Kapcsolatfelvétel, ügyfélszolgálat</td>
              <td>Név, e-mail cím, üzenet tartalma</td>
              <td>Jogos érdek (GDPR 6. cikk (1) f)</td>
            </tr>
            <tr>
              <td>Sütik (cookie-k) kezelése</td>
              <td>Böngészési adatok, süti-beállítások</td>
              <td>Hozzájárulás (GDPR 6. cikk (1) a)</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="3. A kezelt adatok köre és megőrzési ideje">
        <p><strong>Asztalfoglalás:</strong> A foglalással összefüggő adatokat a foglalás időpontjától számított 1 évig őrizzük meg, ezt követően töröljük.</p>
        <p><strong>Kapcsolatfelvétel:</strong> Az üzeneteket és az érintett adatait az ügy lezárását követő 6 hónapig tároljuk.</p>
        <p><strong>Sütik:</strong> A funkcionális sütik legfeljebb 1 évig tárolódnak a böngészőben. A tárolás helyéről és részleteiről a 6. pontban olvashat.</p>
      </Section>

      <Section title="4. Adattovábbítás, adatfeldolgozók">
        <p>Személyes adatait harmadik félnek nem adjuk el, nem adjuk át marketing céllal. Az adatokat az alábbi adatfeldolgozókkal osztjuk meg, kizárólag a szolgáltatás nyújtásához szükséges mértékben:</p>
        <ul>
          <li><strong>Google LLC</strong> – Google Maps beágyazás (helyszín megjelenítése); adatkezelési tájékoztató: <em>policies.google.com/privacy</em></li>
          <li><strong>E-mail szolgáltató (Gmail / SMTP)</strong> – asztalfoglalási visszaigazolások és kapcsolatfelvételi e-mailek küldéséhez</li>
        </ul>
        <p>Az adattovábbítás jogalapja minden esetben a szerződés teljesítése, illetve az adatfeldolgozó igénybevételéhez fűződő jogos érdek.</p>
      </Section>

      <Section title="5. Az érintett jogai">
        <p>Az Általános Adatvédelmi Rendelet (GDPR) alapján Önt az alábbi jogok illetik meg:</p>
        <ul>
          <li><strong>Hozzáférési jog:</strong> Kérheti, hogy tájékoztassuk, milyen adatait kezeljük.</li>
          <li><strong>Helyesbítési jog:</strong> Kérheti pontatlan adatai javítását.</li>
          <li><strong>Törlési jog:</strong> Kérheti adatai törlését, ha az adatkezelés már nem szükséges.</li>
          <li><strong>Az adatkezelés korlátozásához való jog:</strong> Bizonyos esetekben kérheti az adatkezelés korlátozását.</li>
          <li><strong>Adathordozhatóság joga:</strong> Hozzájárulás vagy szerződéses jogalap esetén kérheti adatai géppel olvasható formában való kiadását.</li>
          <li><strong>Tiltakozás joga:</strong> Jogos érdeken alapuló adatkezelésnél tiltakozhat az adatkezelés ellen.</li>
        </ul>
        <p>Kérelmét az <strong>torzshely16@gmail.com</strong> e-mail-címre vagy a fenti postai címre küldheti. Kérelmére 30 napon belül válaszolunk.</p>
        <p>Ha úgy véli, hogy adatkezelésünk jogsértő, panaszt tehet a <strong>Nemzeti Adatvédelmi és Információszabadság Hatóságnál</strong> (NAIH, naih.hu).</p>
      </Section>

      <Section title="6. Sütik (cookie-k)">
        <p>Weboldalunk az alábbi sütiket alkalmazza:</p>
        <table>
          <thead>
            <tr><th>Süti neve</th><th>Célja</th><th>Lejárat</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>cookies_accepted</code></td>
              <td>Süti-hozzájárulás tárolása</td>
              <td>1 év</td>
            </tr>
            <tr>
              <td><code>i18nextLng</code></td>
              <td>Kiválasztott nyelv megjegyzése</td>
              <td>1 év</td>
            </tr>
          </tbody>
        </table>
        <p>A weboldal <strong>nem alkalmaz</strong> harmadik feles nyomkövető vagy reklám-sütiket. A Google Maps beágyazás a Google saját sütiket helyezhet el – ezekről a Google adatkezelési tájékoztatója ad felvilágosítást.</p>
        <p>A sütik kezelését böngészőjében bármikor megváltoztathatja.</p>
      </Section>

      <Section title="7. Adatbiztonság">
        <p>Az adatokat jelszóval védett szerveren tároljuk. Weboldalunk HTTPS protokollon érhető el. Hozzáférése a személyes adatokhoz kizárólag az üzemeltetőknek van.</p>
      </Section>

      <Section title="8. Tájékoztató módosítása">
        <p>Fenntartjuk a jogot, hogy ezt az adatkezelési tájékoztatót módosítsuk. A módosítások a weboldalon való közzétételkor lépnek hatályba. Lényeges változás esetén értesítjük érintettjeinket.</p>
      </Section>
    </div>
  )
}

function EnglishContent() {
  return (
    <div className="prose-pub">
      <h1>Privacy Policy</h1>
      <p className="text-pub-cream/50 text-sm">Effective from: 1 January 2025</p>

      <Section title="1. Data Controller">
        <p>
          <strong>Name:</strong> Törzshely 16<br />
          <strong>Address:</strong> Thököly út 7/b, 1163 Budapest, Hungary<br />
          <strong>Email:</strong> torzshely16@gmail.com<br />
          <strong>Phone:</strong> +36 30 383 9818
        </p>
      </Section>

      <Section title="2. Purpose and Legal Basis of Data Processing">
        <table>
          <thead>
            <tr><th>Purpose</th><th>Data Processed</th><th>Legal Basis</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Table reservation management</td>
              <td>Name, phone number, email, party size, notes</td>
              <td>Contract performance (GDPR Art. 6(1)(b))</td>
            </tr>
            <tr>
              <td>Contact / customer service</td>
              <td>Name, email address, message content</td>
              <td>Legitimate interest (GDPR Art. 6(1)(f))</td>
            </tr>
            <tr>
              <td>Cookies</td>
              <td>Browsing data, cookie preferences</td>
              <td>Consent (GDPR Art. 6(1)(a))</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="3. Retention Periods">
        <p><strong>Reservations:</strong> Data is retained for 1 year from the reservation date, then deleted.</p>
        <p><strong>Contact messages:</strong> Stored for 6 months after the matter is resolved.</p>
        <p><strong>Cookies:</strong> Functional cookies are stored in the browser for up to 1 year.</p>
      </Section>

      <Section title="4. Data Processors">
        <ul>
          <li><strong>Google LLC</strong> – Google Maps embed; see <em>policies.google.com/privacy</em></li>
          <li><strong>Email provider (Gmail / SMTP)</strong> – for sending reservation confirmations and contact replies</li>
        </ul>
        <p>We do not sell or share your data with third parties for marketing purposes.</p>
      </Section>

      <Section title="5. Your Rights">
        <ul>
          <li><strong>Right of access</strong> – request information about data we hold on you</li>
          <li><strong>Right to rectification</strong> – request correction of inaccurate data</li>
          <li><strong>Right to erasure</strong> – request deletion when processing is no longer necessary</li>
          <li><strong>Right to restriction</strong> – request limitation of processing in certain circumstances</li>
          <li><strong>Right to data portability</strong> – receive your data in a machine-readable format</li>
          <li><strong>Right to object</strong> – object to processing based on legitimate interests</li>
        </ul>
        <p>Send requests to <strong>torzshely16@gmail.com</strong>. We respond within 30 days. You may also lodge a complaint with the Hungarian Data Protection Authority (NAIH, naih.hu).</p>
      </Section>

      <Section title="6. Cookies">
        <table>
          <thead>
            <tr><th>Cookie</th><th>Purpose</th><th>Expiry</th></tr>
          </thead>
          <tbody>
            <tr><td><code>cookies_accepted</code></td><td>Stores cookie consent</td><td>1 year</td></tr>
            <tr><td><code>i18nextLng</code></td><td>Remembers language preference</td><td>1 year</td></tr>
          </tbody>
        </table>
        <p>We do not use third-party tracking or advertising cookies.</p>
      </Section>

      <Section title="7. Data Security">
        <p>Data is stored on password-protected servers. The website is accessible via HTTPS. Only operators have access to personal data.</p>
      </Section>

      <Section title="8. Changes to This Policy">
        <p>We reserve the right to update this Privacy Policy. Changes take effect upon publication on the website.</p>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2>{title}</h2>
      {children}
    </section>
  )
}
