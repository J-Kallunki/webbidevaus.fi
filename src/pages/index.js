import React from 'react'
import { StaticQuery, graphql } from 'gatsby'

import Layout from '../components/Layout'
import Header from '../components/Header'

import './index.scss'

function resultToYoutubeVideos(result) {
  return result.edges.map(({ node }) => ({
    ...node,
    publishedAt: new Date(node.publishedAt),
  }))
}

function resultToSimplecastEpisodes(result) {
  return result.edges.map(({ node }) => ({
    ...node,
    publishedAt: new Date(node.publishedAt),
    embedId: node.sharingUrl.split('/s/')[1],
  }))
}

function episodeTitleWithoutNumber(title) {
  return title.replace(/^\d*. /, '')
}

const IndexPage = () => (
  <Layout>
    <StaticQuery
      query={graphql`
        {
          allYoutubeVideo {
            edges {
              node {
                id
                title
                description
                videoId
                publishedAt
                privacyStatus
              }
            }
          }
          allEpisode {
            edges {
              node {
                id
                number
                title
                description
                longDescription
                sharingUrl
                published
              }
            }
          }
        }
      `}
      render={({ allYoutubeVideo, allEpisode }) => {
        const youtubeVideosFromLatest = resultToYoutubeVideos(
          allYoutubeVideo
        ).sort(
          (video1, video2) =>
            video2.publishedAt.valueOf() - video1.publishedAt.valueOf()
        )

        const [latestEpisode, ...otherEpisodes] = resultToSimplecastEpisodes(
          allEpisode
        ).filter(({ published }) => published)
        const [latestVlog] = youtubeVideosFromLatest

        return (
          <div>
            <div className="hero">
              <Header />

              <section className="features padded wrap">
                <div className="feature">
                  <h3 className="feature__title small-title">
                    Uusin podcast-jakso
                  </h3>
                  <div className="newest-podcast">
                    <h1 className="newest-podcast__number">
                      {latestEpisode.number}
                    </h1>

                    <div className="newest-podcast__content">
                      <h1 className="newest-podcast__title">
                        {episodeTitleWithoutNumber(latestEpisode.title)}
                      </h1>
                      <p className="newest-podcast__description">
                        {latestEpisode.description}
                      </p>
                      <p className="newest-podcast__description">
                        <a href="#">Tarkempi kuvaus ja linkit...</a>
                      </p>
                      <iframe
                        frameBorder="0"
                        height="36px"
                        scrolling="no"
                        seamless
                        title={latestEpisode.title}
                        src={`https://simplecast.com/e/${
                          latestEpisode.embedId
                        }?style=light`}
                        width="100%"
                      />
                    </div>
                  </div>
                </div>

                <div className="feature newest-vlog-entry">
                  <h3 className="feature__title small-title">
                    Uusin videojakso
                  </h3>
                  <div className="newest-vlog-entry__container">
                    <iframe
                      title="Viimeisin vlog"
                      src={`https://www.youtube.com/embed/${
                        latestVlog.videoId
                      }`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </section>
            </div>

            <section className="old-episodes padded wrap">
              <div className="old-episodes__filter">
                Näytä:
                <button className="filter-button filter-button--active">
                  Kaikki
                </button>
                <button className="filter-button">Podcast-jaksot</button>
                <button className="filter-button">Videojaksot</button>
                <button className="filter-button">Blogipostaukset</button>
              </div>
              <ol className="old-episode-list">
                {otherEpisodes.map(({ id, number, title }) => (
                  <li key={id} className="old-episode">
                    <h3 className="old-episode__number">{number}</h3>
                    <h3 className="old-episode__title">
                      {episodeTitleWithoutNumber(title)}
                    </h3>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        )
      }}
    />
  </Layout>
)

export default IndexPage
