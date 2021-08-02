// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {useSelector, useDispatch} from 'react-redux';

import styled from 'styled-components';

import {GlobalState} from 'mattermost-redux/types/store';
import {Post} from 'mattermost-redux/types/posts';
import {isSystemMessage} from 'mattermost-redux/utils/post_utils';
import {getPost} from 'mattermost-redux/selectors/entities/posts';
import {getChannel} from 'mattermost-redux/selectors/entities/channels';
import {Channel} from 'mattermost-redux/types/channels';

import PlaybookRunPostMenuIcon from 'src/components/assets/icons/post_menu_icon';

import {addToTimeline, startPlaybookRun, showPostMenuModal} from 'src/actions';

import {useAllowAddMessageToTimelineInCurrentTeam} from 'src/hooks';

import UpgradeBadge from 'src/components/backstage/upgrade_badge';

interface Props {
    postId: string;
}

export const StartPlaybookRunPostMenu = (props: Props) => {
    const dispatch = useDispatch();
    const post = useSelector<GlobalState, Post>((state) => getPost(state, props.postId));
    const channel = useSelector<GlobalState, Channel>((state) => getChannel(state, post.channel_id));
    if (!post || isSystemMessage(post)) {
        return null;
    }

    const handleClick = () => {
        dispatch(startPlaybookRun(channel.team_id, props.postId));
    };

    return (
        <React.Fragment>
            <li
                className='MenuItem'
                role='menuitem'
                onClick={handleClick}
            >
                <button
                    data-testid='playbookRunPostMenuIcon'
                    className='style--none'
                    role='presentation'
                >
                    <PlaybookRunPostMenuIcon/>
                    {'Run playbook'}
                </button>
            </li>
        </React.Fragment>
    );
};

export const AttachToPlaybookRunPostMenu = (props: Props) => {
    const dispatch = useDispatch();
    const allowMessage = useAllowAddMessageToTimelineInCurrentTeam();

    const post = useSelector<GlobalState, Post>((state) => getPost(state, props.postId));
    const channel = useSelector<GlobalState, Channel>((state) => getChannel(state, post.channel_id));
    if (!post || isSystemMessage(post)) {
        return null;
    }

    const handleClick = () => {
        if (allowMessage) {
            dispatch(addToTimeline(channel.team_id, props.postId));
        } else {
            dispatch(showPostMenuModal());
        }
    };

    return (
        <React.Fragment>
            <li
                className='MenuItem'
                role='menuitem'
                onClick={handleClick}
            >
                <button
                    data-testid='playbookRunAddToTimeline'
                    className='style--none'
                    role='presentation'
                >
                    <PlaybookRunPostMenuIcon/>
                    {'Add to run timeline'}
                    {!allowMessage && <PositionedUpgradeBadge/>}
                </button>
            </li>
        </React.Fragment>
    );
};

const PositionedUpgradeBadge = styled(UpgradeBadge)`
    margin-left: 16px;
    margin-bottom: -3px;
`;
