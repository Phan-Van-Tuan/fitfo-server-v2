class CatchLoader {
    static init(app) {
        app.use((req, res, next) => {
            const err = new Error('Endpoint Not Found')
            err.name = "Not Found";
            err.status = 404;
            next(err);
        });

        app.use((err, req, res, next) => {
            res.status(err.status || 500).json({
                error: {
                    name: err.name || "Internal Server Error",
                    status: err.status || 500,
                    message: err.message || "Something went wrong!!"
                }
            });

            if (process.env.NODE_ENV === "development") {
                console.log(`[Exception] ${error}, [Code] ${code}`);
                console.log(`[Error] ${message}`);
                console.log(`[Stack] ${stack}`);
            }
        });
    }
}

export default CatchLoader;