export const reactSelectStyles = {
    control: (styles, state) => ({
        ...styles,
        width: "180px",
        minHeight: "45px",
        border: "1px solid #c0f0de",
        borderRadius: "0",
        backgroundColor: "transparent",
        boxShadow: "0 0 8px 3px rgba(0, 0, 0, 0.3)",
        '&:hover': {
            cursor: "text",
            borderColor: state.isFocused ? "rgb(250, 190, 14)" :"#d6d6d6"
        },
    }),

    placeholder: (styles) => {
        return {
            ...styles,
            color: '#c0f0de',
        }
    },

    option: (styles, state) => ({
        ...styles,
        width: "140px",
        background: "linear-gradient(135deg, rgb(18, 188, 176) 20%, rgb(250, 190, 14) 70%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontWeight: "100",
        fontFamily: "Century Gothic, sans-serif",
        overflow: "hidden",
        '&:hover': {
            background: "none",
            backgroundColor: "rgba(3, 126, 123, 0.5)",
            WebkitBackgroundClip: "unset",
            WebkitTextFillColor: "unset",
            color: "white",
            cursor: "pointer"
        },
    }),

    menu: (styles) => ({
        ...styles,
        width: "180px",
        color: "white",
        backgroundColor: "transparent",
        overflow: "hidden",
        padding: 20,
    }),

    singleValue: (styles) => {
        return {
            ...styles,
            color: "#c0f0de",
        };
    },

    multiValue: (styles) => {
        return {
            ...styles,
            backgroundColor: "transparent",
            overflow: "hidden",
        };
    },

    multiValueLabel: (styles) => ({
        ...styles,
        color: "#c0f0de",
    }),

    multiValueRemove: (styles) => ({
        ...styles,
        color: "white",
        ':hover': {
            color: 'white',
        },
    }),
};
