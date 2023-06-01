{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nix-prez = {
      url = "github:beni69/kareszklub-nix";
      inputs = { nixpkgs.follows = "nixpkgs"; flake-utils.follows = "flake-utils"; };
    };
  };

  outputs = { self, nixpkgs, flake-utils, nix-prez }: flake-utils.lib.eachDefaultSystem (system: nixpkgs.lib.recursiveUpdate
    {
      devShells.default = with import nixpkgs { inherit system; }; mkShell {
        buildInputs = [ prisma-engines openssl ];
        shellHook = ''
          export PRISMA_MIGRATION_ENGINE_BINARY="${prisma-engines}/bin/migration-engine"
          export PRISMA_QUERY_ENGINE_BINARY="${prisma-engines}/bin/query-engine"
          export PRISMA_QUERY_ENGINE_LIBRARY="${prisma-engines}/lib/libquery_engine.node"
          export PRISMA_INTROSPECTION_ENGINE_BINARY="${prisma-engines}/bin/introspection-engine"
          export PRISMA_FMT_BINARY="${prisma-engines}/bin/prisma-fmt"
        '';
      };
    }
    ((nixpkgs.legacyPackages.${system}.callPackage nix-prez.lib { }).mkFlake {
      src = ./prez;
      version = "0.0.0";
      pname = "quiz-prez";
      incremental = true;
    }));
}
