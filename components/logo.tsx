import Link from "next/link"

export default function Logo() {
    return <Link href={"/"}>
        <div className="flex flex-row gap-2 items-center justify-center group">
            <svg width="32" height="32" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-405 transition-transform ease-in-out duration-1000 text-foreground">
                <g clipPath="url(#clip0_1_1371)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M200 100C200 44.7716 155.229 5.42499e-05 100 5.6664e-05C44.7716 5.90781e-05 6.95305e-05 44.7716 7.19228e-05 100C7.43588e-05 155.229 44.7716 200 100 200C155.229 200 200 155.229 200 100ZM114.797 85.2025C123.017 93.4221 135.498 95.1695 160.461 98.6643L170 99.9998L160.461 101.335C135.498 104.83 123.017 106.577 114.797 114.797C106.578 123.017 104.83 135.498 101.336 160.461L100 170L98.6646 160.461C95.1698 135.498 93.4224 123.017 85.2028 114.797C76.9832 106.577 64.5017 104.83 39.5388 101.335L30.0001 99.9998L39.5389 98.6643C64.5018 95.1695 76.9832 93.4221 85.2028 85.2025C93.4224 76.9829 95.1698 64.5015 98.6647 39.5386L100 30.0001L101.335 39.5385C104.83 64.5014 106.578 76.9829 114.797 85.2025Z" fill="currentColor" />
                </g>
                <defs>
                    <clipPath id="clip0_1_1371">
                        <rect width="200" height="200" fill="white" />
                    </clipPath>
                </defs>
            </svg>
            <h1 className="text-4xl tracking-tighter">Place<span className="text-primary">Mate</span></h1>
        </div>
    </Link>
}
