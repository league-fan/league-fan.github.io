import LoadingSkeleton from "@/components/loading";

export default function Loading() {
    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                alignContent: "center",
                justifyContent: "center",
            }}
        >
            <LoadingSkeleton />
        </div>
    )
}