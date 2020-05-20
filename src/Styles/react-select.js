export const reactSelectStyles = {
    control: (styles, state) => ({
        ...styles,
        width: "180px",
        minHeight: "45px",
        border: "1px solid #000",
        borderRadius: "0",
        backgroundColor: "transparent",
       // boxShadow: "0 0 8px 3px rgba(0, 0, 0, 0.3)",
        '&:hover': {
            cursor: "text",
            borderColor: state.isFocused ? "#beebc2" :"#000",
            outline: 'none'
        },
    }),

    placeholder: (styles) => {
        return {
            ...styles,
            color: '#000',
        }
    },

    option: (styles, state) => ({
        ...styles,
        width: "140px",
        backgroundColor: 'transparent',
        fontWeight: "100",
        fontFamily: "Century Gothic, sans-serif",
        overflow: "hidden",
        color: state.isSelected ? "#1d5a7d" : '#000',
        '&:hover': {
            background: "none",
            WebkitBackgroundClip: "unset",
            WebkitTextFillColor: "unset",
            cursor: "pointer"
        },
    }),

    menu: (styles) => ({
        ...styles,
        width: "180px",
        color: "#000",
        backgroundColor: "transparent",
        overflow: "hidden",
        padding: 20,
    }),

    singleValue: (styles) => {
        return {
            ...styles,
            color: "#000",
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
        color: "#000",
    }),

    multiValueRemove: (styles) => ({
        ...styles,
        color: "white",
        ':hover': {
            color: '#000',
        },
    }),
};
