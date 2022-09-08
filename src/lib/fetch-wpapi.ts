import WPAPI from 'wpapi';
import type { Props as PageProps } from '../layouts/Page.astro';

const baseUrl = 'https://public-api.wordpress.com/wp/v2/sites';
const endpoint = `${ baseUrl }/${ import.meta.env.WPCOM_SITE }.wordpress.com`;
const wp = new WPAPI( { endpoint } );

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

  const { blocks, content, date_gmt: published, title } = page;
	const link = 'home' === slug ? '/' : `/${ slug }/`;

  return {
    content: content.rendered,
		link,
    published,
    slug,
    title: title.rendered,
  };
}
