import WPAPI from 'wpapi';
import type { Props as PageProps } from '../layouts/Page.astro';

const baseUrl = 'https://public-api.wordpress.com/wp/v2/sites';
const endpoint = `${ baseUrl }/${ import.meta.env.WPCOM_SITE }.wordpress.com`;
const wp = new WPAPI( { endpoint } );

function getPageProps( page: any ): PageProps {
	const { blocks, content, date_gmt: published, link: fullLink, slug, title } = page;
	const link = new URL( fullLink ).pathname;

  return {
    content: content.rendered,
		link,
    published,
    slug,
    title: title.rendered,
  };
}

export async function fetchPages(): Promise<PageProps[]> {
  const pages = await wp
    .root( `pages` )
    .get()
    .catch( () => [] );

	return pages.map( getPageProps );
}

export async function fetchPageBySlug( slug: string | number | undefined ): Promise<PageProps | null> {
	if ( 'string' !== typeof slug || ! slug ) {
		return null;
	}

  const [ page ] = await wp
    .root( `pages?slug=${ slug }` )
    .get()
    .catch( () => [] );

  if ( ! page ) {
    return null;
  }

	return getPageProps( page );
}
