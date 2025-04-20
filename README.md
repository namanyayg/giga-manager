# Giga MCP

Install and manage Model Context Protocol (MCP) packages as required by your current project.

It can:

* List some fake MCPs (`list_available_mcps`)
* Tell you more about a specific MCP (`get_mcp_details`)
* Look at your `package.json` or `requirements.txt` to suggest useful MCPs (`suggest_mcps`)
* Provide installation commands for suggested MCPs (`install_mcps`)

## Usage

1.  Make sure you have Node.js installed.
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  (Optional) Create a `.env` file if you want to change the port (or just use the default 9000).
    ```
    PORT=your_preferred_port
    ```
4.  Start the server:
    ```bash
    node src/index.js
    ```
5.  Connect to an MCP client like Cursor or Windsurf via `https://localhost:9000/sse`

## License

This project is licensed under the AGPL-3.0-only license - see the [LICENSE](LICENSE) file for details.
