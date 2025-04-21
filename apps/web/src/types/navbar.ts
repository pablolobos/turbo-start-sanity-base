export type Button = {
    text: string | null;
    variant: "default" | "primary" | "outline" | "secondary" | "link" | null;
    icon: "volvo-chevron-right" | "volvo-file-down" | null;
    _key: string;
    _type: "button";
    href: string | null;
    openInNewTab: boolean | null;
};

export type NavbarLink = {
    _key: string;
    type: "link";
    name: string | null;
    description: string | null;
    openInNewTab: boolean | null;
    href: string | null;
};

export type NavbarColumn = {
    _key: string;
    type: "column";
    title: string | null;
    links: Array<{
        _key: string;
        type: "link" | "group";
        name: string | null;
        icon: string | null;
        description: string | null;
        openInNewTab: boolean | null;
        href: string | null;
        title?: string | null;
        links?: Array<{
            _key: string;
            name: string | null;
            icon: string | null;
            description: string | null;
            openInNewTab: boolean | null;
            href: string | null;
        }> | null;
    }> | null;
};

export type NavbarData = {
    _id: string;
    columns: Array<NavbarColumn | NavbarLink> | null;
    buttons: Array<Button> | null;
    logo: string | null;
    siteTitle: string | null;
    customerServicePhone: string | null;
    roadEmergencyPhone: string | null;
    roadEmergencyPhone2: string | null;
    contactPageUrl: string | null;
} | null; 