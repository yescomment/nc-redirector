const redirectsJson = require('/redirects.json')
import Head from 'next/head'

export default function TableOfContents({ redirects }) {
  return (
    <article>
      <Head>
        <title>Redirects of Jacob Ford</title>
      </Head>
      <p><a href="//jacobford.com">Jacob Ford</a> buys funny little domains and sends them to relevant little places, for <a href="//nocomment.llc">business</a> + pleasure.</p>
      <p>His favorites are when he snags one from the background of fiction.</p>
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
