export interface ComponentsConfig {
    grpc: {
        //#module grpc_server
        readonly server: {
            readonly port: number
        };
        //#endmodule grpc_server
        //#module grpc_client
        readonly clients: {
            readonly package: string,
            readonly address: string
        }[];
        //#endmodule grpc_client
    };
}
