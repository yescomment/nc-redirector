const redirectsJson = require('/redirects.json')
import Head from 'next/head'

export default function TableOfContents({ redirects }) {
  return (
    <article>
      <Head>
        <title>Redirects of Jacob Ford</title>
      </Head>
      <p>I collect domains, for <a href="//nocomment.llc">business</a> + pleasure.</p>
      <p>Examples include: fun new TLDs (.museum), ancient and forgotten campaigns (owlcitygalaxy.com), and sniping from the background of fiction (higginsgear.com, chirpeo.com), and pranks.</p>
      <ul>
      {Object.keys(redirects).map(domain =>
        <li key={domain}><a href={`//${domain}`}>{domain}</a></li>
      )}
      </ul>
    </article>
  )
}

export async function getStaticProps(context) {
  return {
    props: {
      redirects: redirectsJson
    },
  }
}
