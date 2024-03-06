import { getAllFiles } from "../src/utils"

test("getAllFiles util function returns all files in a directory", () => {
    const files: string[] = getAllFiles("tests/test-files/getAllFiles-sample-files")
    expect(files).toContain("tests/test-files/getAllFiles-sample-files/dir1/test1_dir1.js")
    expect(files).toContain("tests/test-files/getAllFiles-sample-files/test1.js")
    expect(files).toContain("tests/test-files/getAllFiles-sample-files/test2.js")
    expect(files).toContain("tests/test-files/getAllFiles-sample-files/test3.js")
})
