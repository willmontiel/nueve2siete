"""HTTP API. Internal service: only the web app calls it, never the browser."""

from typing import Annotated

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from pydantic import ValidationError

from .analyze import analyze
from .imaging import UnsupportedImageError
from .schemas import AnalysisResult, AnalyzeOptions

MAX_UPLOAD_BYTES = 10 * 1024 * 1024

app = FastAPI(title="nueve2siete engine", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/v1/analyze", response_model=AnalysisResult)
async def analyze_endpoint(
    file: Annotated[UploadFile, File()], options: Annotated[str, Form()] = "{}"
) -> AnalysisResult:
    try:
        parsed = AnalyzeOptions.model_validate_json(options)
    except ValidationError as error:
        raise HTTPException(status_code=422, detail=error.errors(include_url=False)) from error

    data = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="File is larger than 10 MB")

    try:
        return analyze(data, parsed)
    except UnsupportedImageError as error:
        raise HTTPException(status_code=415, detail=str(error)) from error
