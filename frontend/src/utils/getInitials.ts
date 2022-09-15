const getInitials = (str: string): string => {
    if (str.length >= 2)
        return `${str.split(' ')[0][0]}${str.split(' ')[1][0]}`;
    return `${str.split(' ')[0][0]}`;
};

export default getInitials;