from fastapi import FastAPI
from pydantic import BaseModel
import time

app = FastAPI()

class ModelPayload(BaseModel):
    input: dict

@app.post('/run-model')
async def run_model(payload: ModelPayload):
    start = time.time()
    # simulate work
    time.sleep(1)
    result = {"echo": payload.input, "processed_at": time.time()}
    return {"ok": True, "result": result, "duration_sec": time.time() - start}
