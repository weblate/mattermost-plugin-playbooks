// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import styled from 'styled-components';

const Component = styled.label`
    padding: 10px 16px;
    border-radius: 4px;
    margin-bottom: 0;
    cursor: pointer;
    user-select: none;

    transition: background-color 0.2s;

    &:hover {
        background-color: var(--button-bg-08);
    }

    input {
        display: none;
    }

    input + span::before {
        content: '\f12c';
        font-family: compass-icons;
        font-size: 14px;

        height: 16px;
        width: 16px;
        margin-right: 10px;

        border-radius: 2px;
        border: 1px solid var(--center-channel-color-24);
        background-color: var(--center-channel-bg);
        color: var(--center-channel-bg);

        transition: color 0.2s, background-color 0.2s;
    }

    input:checked + span::before {
        border: 1px solid transparent;
        background-color: var(--button-bg);
        color: var(--button-color);
    }
`;

interface Props {
    testId: string;
    text: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const CheckboxInput = (props: Props) => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(event.target.checked);
    };

    return (
        <Component data-testid={props.testId}>
            <input
                type='checkbox'
                onChange={onChange}
                checked={props.checked}
            />
            <span>
                {props.text}
            </span>
        </Component>
    );
};

export default CheckboxInput;
