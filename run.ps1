Write-Host "Building C++ module..."

cd engine
python setup.py build_ext --inplace

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed"
    exit 1
}

Write-Host "Moving module..."

Move-Item .\engine*.pyd ..\backend\engine.pyd -Force

Write-Host "Starting server..."

cd ..\backend
uvicorn server:app --host 0.0.0.0 --port 8000 --reload