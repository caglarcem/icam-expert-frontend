import React, { ChangeEvent } from 'react';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';

type TextAreaProps = {
    placeholder: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    style?: React.CSSProperties;
};

const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const StyledTextarea = styled(BaseTextareaAutosize)(
    ({ theme }) => `
        box-sizing: border-box;
        width: 320px;
        font-family: 'Arial';
        font-size: 16px;
        font-weight: 400;
        line-height: 1.5;
        padding: 8px 12px;
        border-radius: 8px;
        color: ${theme.palette.mode === 'dark' ? grey[100] : grey[900]};
        background: ${theme.palette.mode === 'dark' ? grey[800] : '#fff'};
        border: 1px solid ${
            theme.palette.mode === 'dark' ? grey[700] : grey[200]
        };
        box-shadow: 0px 2px 2px ${
            theme.palette.mode === 'dark' ? grey[900] : grey[50]
        };

        &:hover {
            border-color: ${blue[400]};
        }

        &:focus {
            border-color: ${blue[400]};
            box-shadow: 0 0 0 3px ${
                theme.palette.mode === 'dark' ? blue[200] : blue[200]
            };
        }

        // firefox
        &:focus-visible {
            outline: 0;
        }
    `
);

const TextArea: React.FC<TextAreaProps> = ({
    placeholder,
    onChange,
    style,
}) => {
    return (
        <StyledTextarea
            aria-label="minimum height"
            minRows={3}
            placeholder={placeholder}
            onChange={onChange}
            style={style}
        />
    );
};

export default TextArea;
