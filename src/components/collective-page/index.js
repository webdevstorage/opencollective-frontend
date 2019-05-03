import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flex } from '@rebass/grid';

import theme from '../../constants/theme';
import { debounceScroll } from '../../lib/ui-utils';

import { AllSectionsNames, Dimensions } from './_constants';
import Hero from './Hero';
import Container from '../Container';

/**
 * This is the collective page main layout, holding different blocks together
 * and watching scroll to synchronise the view for children properly.
 *
 * See design: https://www.figma.com/file/e71tBo0Sr8J7R5n6iMkqI42d/09.-Collectives?node-id=2338%3A36062
 */
export default class CollectivePage extends Component {
  static propTypes = {
    /** The collective to display */
    collective: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      image: PropTypes.string,
      backgroundImage: PropTypes.string,
      twitterHandle: PropTypes.string,
      githubHandle: PropTypes.string,
      website: PropTypes.string,
      description: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,

    /** Collective's host */
    host: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      image: PropTypes.string,
    }),

    /** The logged in user */
    LoggedInUser: PropTypes.object,
  };

  state = { isFixed: false };

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    this.onScroll(); // First tick in case scroll is restored when page loads
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  // Fixes the Hero when a certain scroll threshold is reached
  onScroll = debounceScroll(() => {
    const collapsePoint = theme.sizes.navbarHeight + Dimensions.HERO_FIXED_HEIGHT;
    if (window.scrollY >= collapsePoint) {
      if (!this.state.isFixed) {
        this.setState({ isFixed: true });
      }
    } else if (this.state.isFixed) {
      this.setState({ isFixed: false });
    }
  });

  render() {
    const { collective, host, LoggedInUser } = this.props;
    const canEditCollective = LoggedInUser && LoggedInUser.canEditCollective(collective);

    return (
      <Container borderTop="1px solid #E6E8EB">
        <Container borderBottom="1px solid #E6E8EB">
          <Hero
            collective={collective}
            host={host}
            sections={AllSectionsNames}
            canEditCollective={canEditCollective}
            isFixed={this.state.isFixed}
          />
        </Container>

        {this.state.isFixed && <Container height={Dimensions.HERO_FIXED_HEIGHT * 2} />}

        {/* Placeholders for sections not implemented yet */}
        {AllSectionsNames.map(section => (
          <React.Fragment key={section}>
            <Flex id={`section-${section}`} py={7} justifyContent="center">
              [Section] {section}
            </Flex>
            <hr />
          </React.Fragment>
        ))}
      </Container>
    );
  }
}
